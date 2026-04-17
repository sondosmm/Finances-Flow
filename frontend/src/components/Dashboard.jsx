import { useEffect, useState } from "react";
import axios from "axios";
import AssistantChat from "./AssistantChat";
import ExpenseForm from "./ExpenseForm";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API = "http://localhost:5000/api/v1";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function Dashboard({ onLogout, onProfile }) {
  const [expenses, setExpenses] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [user, setUser] = useState(null);
  const [monthSummary, setMonthSummary] = useState({ totalSpent: 0, budget: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  const fetchData = async () => {
    try {
      const { data: userRes } = await axios.get(`${API}/user/me`, { withCredentials: true });
      setUser(userRes.data);

      const { data: exp } = await axios.get(`${API}/expense/getExpenses?limit=50`, { withCredentials: true });
      setExpenses(exp.data);

      const cats = {};
      exp.data.forEach(e => {
        cats[e.category] = (cats[e.category] || 0) + e.amount;
      });
      setCategoryData(Object.entries(cats).map(([name, value]) => ({ name, value })));

      const now = new Date();
      const { data: monthRes } = await axios.get(`${API}/report/monthly?month=${now.getMonth() + 1}&year=${now.getFullYear()}`, { withCredentials: true });
      setMonthSummary(monthRes.summary);

      const currentYear = now.getFullYear();
      const { data: yearlyRes } = await axios.get(`${API}/report/yearly?year=${currentYear}`, { withCredentials: true });
      setYearlyData(yearlyRes.summary);

    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      onLogout();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`${API}/expense/deleteExpense/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const exportReport = async () => {
    try {
      const now = new Date();
      window.open(`${API}/report/excel?month=${now.getMonth() + 1}&year=${now.getFullYear()}`, "_blank");
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const budgetSpentPercent = Math.min(Math.round((monthSummary.totalSpent / (monthSummary.budget || 1)) * 100), 100);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Finance Flow</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowForm(true)} style={styles.priBtn}>Add Expense</button>
          <button onClick={exportReport} style={styles.secBtn}>Export CSV</button>
          <button onClick={onProfile} style={styles.secBtn}>Profile</button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Stats Row */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Budget</span>
            <span style={styles.statValue}>${monthSummary.budget}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Spent</span>
            <span style={{ ...styles.statValue, color: "#ef4444" }}>${monthSummary.totalSpent}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Remaining</span>
            <span style={{ ...styles.statValue, color: "#10b981" }}>${Math.max(0, monthSummary.budget - monthSummary.totalSpent)}</span>
          </div>
        </div>

        <div style={styles.grid}>
          {/* Budget Chart */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Monthly Budget Usage</h3>
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
               <div style={{ ...styles.progressCircle, background: `conic-gradient(#2563eb ${budgetSpentPercent}%, #f4f4f5 0)` }}>
                  <div style={styles.progressInner}>{budgetSpentPercent}%</div>
               </div>
               <p style={{ marginTop: 10, fontSize: 14, color: "#71717a" }}>Spent of your monthly budget</p>
            </div>
          </div>

          {/* Category Chart */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Expenses by Category</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

           {/* Yearly Chart */}
           <div style={{ ...styles.card, gridColumn: "span 2" }}>
            <h3 style={styles.cardTitle}>Spending Trends (Yearly)</h3>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <section style={{ ...styles.card, marginTop: 24 }}>
          <h3 style={styles.cardTitle}>Recent Transactions</h3>
          <div style={styles.list}>
            {expenses.map((e) => (
              <div key={e._id} style={styles.item}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ ...styles.dot, background: COLORS[categoryData.findIndex(c => c.name === e.category) % COLORS.length] }}></div>
                  <div>
                    <div style={styles.cat}>{e.category}</div>
                    <div style={styles.desc}>{e.description}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={styles.amt}>${e.amount}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setEditExpense(e); setShowForm(true); }} style={styles.iconBtn}>✎</button>
                    <button onClick={() => handleDelete(e._id)} style={{ ...styles.iconBtn, color: "#ef4444" }}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showForm && (
        <ExpenseForm 
          editExpense={editExpense} 
          onCancel={() => { setShowForm(false); setEditExpense(null); }} 
          onExpenseAdded={() => { setShowForm(false); setEditExpense(null); fetchData(); }} 
        />
      )}

      <AssistantChat />
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f8fafc" },
  header: { display: "flex", justifyContent: "space-between", padding: "16px 40px", borderBottom: "1px solid #e2e8f0", background: "#fff", position: "sticky", top: 0, zIndex: 10 },
  logo: { fontSize: 20, fontWeight: "800", color: "#1e293b", letterSpacing: "-0.5px" },
  priBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: "600" },
  secBtn: { background: "#fff", border: "1px solid #e2e8f0", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: "600" },
  logoutBtn: { background: "#f1f5f9", color: "#475569", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: "600" },
  main: { padding: "32px 40px", maxWidth: 1100, margin: "0 auto" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 24 },
  statCard: { background: "#fff", padding: "20px", borderRadius: 16, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 4 },
  statLabel: { fontSize: 13, color: "#64748b", fontWeight: "500" },
  statValue: { fontSize: 24, fontWeight: "700", color: "#1e293b" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  card: { background: "#fff", padding: 24, borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 20, color: "#1e293b" },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  item: { display: "flex", justifyContent: "space-between", padding: "14px 18px", borderRadius: 14, background: "#fff", border: "1px solid #f1f5f9", transition: "all 0.2s" },
  dot: { width: 8, height: 8, borderRadius: "50%" },
  cat: { fontSize: 11, fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
  desc: { fontSize: 15, color: "#1e293b", fontWeight: "500" },
  amt: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 4, borderRadius: 6, transition: "background 0.2s" },
  progressCircle: { width: 120, height: 120, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" },
  progressInner: { width: 90, height: 90, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: "800", color: "#1e293b" },
};
