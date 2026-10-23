import { useEffect, useState } from "react";

const KEY = "orders-key";

function formatWhen(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Riyadh",
  }).format(date);
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadCsv(orders) {
  const header = ["When", "Name", "Mobile", "City", "Order", "Total", "Delivery"];
  const rows = orders.map((order) => [
    formatWhen(order.createdAt),
    order.name,
    order.mobile,
    order.city,
    order.label,
    `SAR ${Number(order.price).toFixed(2)}`,
    order.delivery,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "customer-orders.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function Orders() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(KEY) || "");
  const [orders, setOrders] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(secret) {
    setLoading(true);
    setError("");
    const response = await fetch("/api/orders", {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      sessionStorage.removeItem(KEY);
      setReady(false);
      setError(data.message || "Could not open the order list.");
      return;
    }
    sessionStorage.setItem(KEY, secret);
    setOrders(data.orders || []);
    setReady(true);
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY);
    if (saved) load(saved);
  }, []);

  function onSubmit(event) {
    event.preventDefault();
    load(password.trim());
  }

  return (
    <main className="order-list">
      <h1>Customer orders</h1>
      <p>Orders placed on the Kinoki page. Times are shown in Saudi Arabia.</p>
      {ready ? (
        <>
          <div className="order-list-bar">
            <strong>{orders.length} orders</strong>
            <button type="button" onClick={() => downloadCsv(orders)} disabled={!orders.length}>
              Download CSV
            </button>
          </div>
          {orders.length ? (
            <div className="order-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Order</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{formatWhen(order.createdAt)}</td>
                      <td>{order.name}</td>
                      <td>{order.mobile}</td>
                      <td>{order.city}</td>
                      <td>{order.label}</td>
                      <td>SAR {Number(order.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="order-empty">No orders yet.</p>
          )}
        </>
      ) : (
        <form className="order-lock" onSubmit={onSubmit}>
          <label>
            Password
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="order-lock-error">{error}</p> : null}
          <button type="submit" disabled={loading}>
            {loading ? "Opening…" : "Open list"}
          </button>
        </form>
      )}
    </main>
  );
}
