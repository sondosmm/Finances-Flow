import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/v1/user";

export default function Profile({ onBack }) {
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API}/me`, { withCredentials: true });
        setBudget(data.data.budget);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.put(`${API}/update`, { budget }, { withCredentials: true });
      setMessage("Budget updated successfully!");
    } catch (err) {
      setMessage("Failed to update budget.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>
        <h2 style={styles.title}>Your Profile</h2>
        <form onSubmit={handleUpdate} style={styles.form}>
          <label style={styles.label}>Monthly Budget ($)</label>
          <input
            type="number"
            style={styles.input}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Saving..." : "Update Budget"}
          </button>
        </form>
        {message && <p style={styles.msg}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f5" },
  card: { background: "#fff", padding: 32, borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: 340 },
  backBtn: { background: "none", border: "none", cursor: "pointer", color: "#71717a", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 24 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 14, color: "#71717a" },
  input: { padding: "12px 16px", borderRadius: 8, border: "1px solid #e4e4e7" },
  button: { padding: 12, borderRadius: 8, background: "#18181b", color: "#fff", border: "none", cursor: "pointer" },
  msg: { marginTop: 16, textAlign: "center", color: "#10b981", fontSize: 14 }
};
