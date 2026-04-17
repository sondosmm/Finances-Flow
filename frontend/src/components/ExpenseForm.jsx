import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function ExpenseForm({ onExpenseAdded, onCancel, editExpense = null }) {
  const [amount, setAmount] = useState(editExpense ? editExpense.amount : "");
  const [category, setCategory] = useState(editExpense ? editExpense.category : "");
  const [description, setDescription] = useState(editExpense ? editExpense.description : "");
  const [date, setDate] = useState(editExpense ? new Date(editExpense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { amount: Number(amount), category, description, date };
      if (editExpense) {
        await axios.put(`${API}/expense/updateExpense/${editExpense._id}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${API}/expense/createExpense`, payload, { withCredentials: true });
      }
      onExpenseAdded();
    } catch (err) {
      console.error("Failed to save expense", err);
      alert("Error saving expense. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{editExpense ? "Edit Expense" : "Add New Expense"}</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00" />
          </div>
          <div style={styles.field}>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Rent">Rent</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={styles.field}>
            <label>Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Coffee, Grocery, etc." />
          </div>
          <div style={styles.field}>
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div style={styles.actions}>
            <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Saving..." : editExpense ? "Update" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", padding: 32, borderRadius: 20, width: "90%", maxWidth: 400, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
  form: { display: "flex", flexDirection: "column", gap: 16, marginTop: 20 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  actions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 },
  cancelBtn: { padding: "10px 16px", borderRadius: 10, border: "1px solid #e4e4e7", background: "none", cursor: "pointer" },
  submitBtn: { padding: "10px 16px", borderRadius: 10, border: "none", background: "#18181b", color: "#fff", cursor: "pointer" },
};
