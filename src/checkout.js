/**
 * Checkout integration boundary.
 * The reference page posts orders to its own endpoint. This project does not
 * call that endpoint, and it does not record a payment.
 * Replace `submitOrder` with your order API when you have one.
 */
export async function submitOrder() {
  return {
    ok: false,
    code: "not_configured",
    message:
      "No order was placed. Checkout is not connected, so nothing was sent for delivery or payment.",
  };
}
