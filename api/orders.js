import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { get, list, put } from "@vercel/blob";

const PACKS = {
  119: { quantity: 40, label: "4 boxes — SAR 119" },
  149: { quantity: 80, label: "8 boxes — SAR 149" },
};

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function clean(value, max) {
  return String(value || "")
    .replace(/[\u0000-\u001F]/g, "")
    .trim()
    .slice(0, max);
}

function sameSecret(given, expected) {
  const left = createHash("sha256").update(String(given)).digest();
  const right = createHash("sha256").update(String(expected)).digest();
  return timingSafeEqual(left, right);
}

function authorized(req) {
  const expected = process.env.ORDERS_PASSWORD;
  if (!expected) return false;
  const header = String(req.headers.authorization || "");
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  return given.length > 0 && sameSecret(given, expected);
}

function readOrder(body) {
  const price = Number(body?.price);
  const pack = PACKS[price];
  const name = clean(body?.name, 80);
  const mobile = clean(body?.mobile, 20).replace(/\D/g, "");
  const city = clean(body?.city, 80);
  if (!pack) return { error: "Choose a valid package." };
  if (name.length < 2) return { error: "Please enter the recipient's name." };
  if (mobile.length < 8) return { error: "Please enter a contact mobile number." };
  if (city.length < 2) return { error: "Please enter your city." };
  return {
    order: {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      name,
      mobile,
      city,
      product: "Kinoki Cleansing Detox Foot Pads",
      label: pack.label,
      quantity: pack.quantity,
      price,
      currency: "SAR",
      delivery: "Cash on delivery",
    },
  };
}

async function readOrders() {
  const orders = [];
  let cursor;
  do {
    const page = await list({ prefix: "orders/", cursor, limit: 1000 });
    for (const blob of page.blobs) {
      const file = await get(blob.pathname, { access: "private" });
      if (!file) continue;
      const text = await new Response(file.stream).text();
      orders.push(JSON.parse(text));
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  orders.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return orders;
}

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const parsed = readOrder(body);
      if (parsed.error) return json(res, 400, { message: parsed.error });
      await put(`orders/${parsed.order.id}.json`, JSON.stringify(parsed.order), {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
      });
      return json(res, 200, {
        message: "Order received. We will contact you to arrange cash on delivery.",
      });
    }

    if (req.method === "GET") {
      if (!authorized(req)) return json(res, 401, { message: "Enter the orders password." });
      const orders = await readOrders();
      return json(res, 200, { orders });
    }

    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { message: "Method not allowed." });
  } catch {
    return json(res, 500, { message: "Could not save the order. Please try again." });
  }
}
