export async function submitOrder(order) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      ok: false,
      message: data.message || "Could not save the order. Please try again.",
    };
  }
  return {
    ok: true,
    message: data.message || "Order received. We will contact you to arrange cash on delivery.",
  };
}
