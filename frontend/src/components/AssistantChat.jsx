import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const API = `${API_BASE}/assistant`;

export default function AssistantChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi! Ask me anything or say 'add 50 for food'",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const bottomRef = useRef(null);
  const mediaRef = useRef(null);
  const chunkRef = useRef([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendText = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API}/chat`,
        { message: msg },
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, { from: "ai", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      chunkRef.current = [];

      recorder.ondataavailable = (e) => chunkRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunkRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        setLoading(true);
        setMessages((prev) => [
          ...prev,
          { from: "user", text: "Sending voice..." },
        ]);

        try {
          const { data } = await axios.post(`${API}/voice`, formData, {
            withCredentials: true,
          });
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { from: "user", text: data.transcribed },
            { from: "ai", text: data.result.reply },
          ]);
        } catch (err) {
          console.error(err);
          setMessages((prev) => [
            ...prev,
            { from: "ai", text: "Could not process voice." },
          ]);
        } finally {
          setLoading(false);
        }
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendText();
  };

  return (
    <>
      {/* floating bubble button */}
      <button onClick={() => setOpen((o) => !o)} style={styles.bubble}>
        {open ? "✕" : "💬"}
      </button>

      {/* chat window */}
      {open && (
        <div style={styles.window}>
          {/* messages area */}
          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  background: m.from === "user" ? "#18181b" : "#f4f4f5",
                  color: m.from === "user" ? "#fff" : "#18181b",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  ...styles.message,
                  alignSelf: "flex-start",
                  background: "#f4f4f5",
                }}
              >
                typing...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* input area */}
          <div style={styles.inputArea}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
            />
            <button onClick={sendText} style={styles.btn}>
              ➤
            </button>
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              style={{
                ...styles.btn,
                background: recording ? "#ef4444" : "#18181b",
              }}
            >
              🎤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  bubble: {
    position: "fixed",
    bottom: 28,
    right: 28,
    zIndex: 1000,
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "#18181b",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: 22,
  },
  window: {
    position: "fixed",
    bottom: 90,
    right: 28,
    zIndex: 999,
    width: 340,
    height: 480,
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  message: {
    padding: "8px 12px",
    borderRadius: 12,
    maxWidth: "80%",
    fontSize: 14,
    lineHeight: 1.5,
  },
  inputArea: {
    display: "flex",
    padding: 10,
    gap: 6,
    borderTop: "1px solid #f4f4f5",
  },
  input: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e4e4e7",
    outline: "none",
    fontSize: 14,
  },
  btn: {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#18181b",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },
};
