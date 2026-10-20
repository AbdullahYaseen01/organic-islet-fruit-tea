export const SHORT_NAME = "Kinoki Cleansing Detox Foot Pads";

export const HEADLINE = "Kinoki Cleansing Detox Foot Pads";

export const LEAD =
  "Stick a pad on each sole before you rest. The box says cleanse and energize your body. Each box has 10 pieces, and delivery is free.";

export const PRODUCT_NAME =
  "Kinoki Cleansing Detox Foot Pads. White adhesive pads for the soles, sold in boxes of 10. The packaging says cleanse and energize your body.";

export const HERO_PRICE = "AED 50.00";
export const HERO_OLD_PRICE = "";

export const COMBOS = [
  {
    id: "box-1",
    quantity: 10,
    price: 50,
    label: "1 box (10 pieces) — AED 50",
  },
  {
    id: "box-2",
    quantity: 20,
    price: 80,
    label: "2 boxes (20 pieces) — AED 80",
  },
  {
    id: "box-3",
    quantity: 30,
    price: 99,
    label: "Best value · 3 boxes (30 pieces) — AED 99",
  },
];

export const REVIEWS = [
  {
    name: "Nadia",
    stars: 5,
    text: "I stick the Kinoki pad on before bed. It stays put, and it peels off easily in the morning.",
  },
  {
    name: "Omar",
    stars: 5,
    text: "The box came with free delivery. Ten pads was enough for me to try a full round.",
  },
  {
    name: "Lina",
    stars: 4,
    text: "The white pad is simple to place on the sole. The box is clearly labeled Kinoki.",
  },
  {
    name: "Hassan",
    stars: 5,
    text: "I took the two-box offer. The pads are easy to use and the price for 20 pieces made sense.",
  },
];

export const GALLERY = [
  {
    type: "image",
    src: "/images/desc/hands-product.jpg",
    alt: "Hands holding a Kinoki Cleansing Detox Foot Pads box and one adhesive pad.",
  },
  {
    type: "image",
    src: "/images/desc/two-boxes.jpg",
    alt: "Two Kinoki Cleansing Detox Foot Pads boxes on a pale background.",
  },
  {
    type: "image",
    src: "/images/desc/boxes-studio.jpg",
    alt: "A single Kinoki box in a studio shot.",
  },
  {
    type: "image",
    src: "/images/desc/pad-closeup.jpg",
    alt: "Close-up of a white Kinoki foot pad with a brown center.",
  },
  {
    type: "image",
    src: "/images/desc/apply-sole.jpg",
    alt: "A Kinoki pad being pressed onto the sole of a foot.",
  },
  {
    type: "image",
    src: "/images/desc/soles.jpg",
    alt: "Both soles wearing white Kinoki detox pads.",
  },
  {
    type: "image",
    src: "/images/desc/how-to-use.jpg",
    alt: "Three steps for peeling, pressing, and removing the Kinoki pad.",
  },
  {
    type: "image",
    src: "/images/desc/used-pad.jpg",
    alt: "A used Kinoki pad next to a fresh pad.",
  },
  {
    type: "image",
    src: "/images/desc/morning-tray.jpg",
    alt: "A morning tray with a Kinoki box and fresh pads.",
  },
];

export function formatPrice(amount) {
  return `AED ${Number(amount).toFixed(2)}`;
}
