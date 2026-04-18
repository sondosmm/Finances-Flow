import { useState } from "react";
import axios from "axios";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const API = import.meta.env.VITE_API_URL;
    console.log("API URL:", API);
    const url = `${API}/auth/${isLogin ? "login" : "register"}`;
    try {
      await axios.post(url, form, { withCredentials: true });
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              style={styles.input}
              placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p style={styles.toggle} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f5" },
  card: { background: "#fff", padding: 32, borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: 340 },
  title: { textAlign: "center", marginBottom: 24, fontSize: 24, fontWeight: "600" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { padding: "12px 16px", borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 14 },
  button: { padding: 12, borderRadius: 8, background: "#18181b", color: "#fff", border: "none", cursor: "pointer", fontWeight: "600" },
  error: { color: "#ef4444", fontSize: 12, textAlign: "center" },
  toggle: { textAlign: "center", marginTop: 16, fontSize: 14, color: "#71717a", cursor: "pointer" }
};
