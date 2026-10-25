const PIXEL_ID = "1108215061836716";

function ready() {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function eventId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

function firstName(value) {
  return String(value || "").trim().split(/\s+/)[0] || "";
}

function matchCustomer({ name, mobile, city }) {
  if (!ready()) return;
  const phone = digits(mobile);
  const userData = { country: "sa" };
  if (phone) {
    userData.ph = phone.startsWith("966") ? phone : `966${phone.replace(/^0/, "")}`;
  }
  const fn = firstName(name).toLowerCase();
  if (fn) userData.fn = fn;
  const ct = String(city || "").trim().toLowerCase();
  if (ct) userData.ct = ct;
  window.fbq("init", PIXEL_ID, userData);
}

export function trackViewContent({ price = 119 } = {}) {
  if (!ready()) return;
  window.fbq(
    "track",
    "ViewContent",
    {
      content_name: "Kinoki Cleansing Detox Foot Pads",
      content_ids: ["kinoki-pack-4", "kinoki-pack-8"],
      content_type: "product",
      value: Number(price),
      currency: "SAR",
    },
    { eventID: eventId("vc") },
  );
}

export function trackInitiateCheckout({ price, quantity, comboId }) {
  if (!ready()) return;
  window.fbq(
    "track",
    "InitiateCheckout",
    {
      content_name: "Kinoki Cleansing Detox Foot Pads",
      content_ids: [comboId || "kinoki-pack-8"],
      content_type: "product",
      contents: [{ id: comboId || "kinoki-pack-8", quantity: Number(quantity) || 1 }],
      num_items: 1,
      value: Number(price) || 0,
      currency: "SAR",
    },
    { eventID: eventId("ic") },
  );
}

export function trackOrder({ name, mobile, city, price, quantity, comboId }) {
  if (!ready()) return;
  matchCustomer({ name, mobile, city });
  const payload = {
    content_name: "Kinoki Cleansing Detox Foot Pads",
    content_ids: [comboId || "kinoki-pack-8"],
    content_type: "product",
    contents: [{ id: comboId || "kinoki-pack-8", quantity: Number(quantity) || 1 }],
    num_items: 1,
    value: Number(price) || 0,
    currency: "SAR",
  };
  const leadId = eventId("lead");
  const purchaseId = eventId("purchase");
  window.fbq("track", "Lead", payload, { eventID: leadId });
  window.fbq("track", "Purchase", payload, { eventID: purchaseId });
}
