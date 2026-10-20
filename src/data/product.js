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
    note: "Ordered 1 box",
    stars: 5,
    text: "I was not sure at first, so I tried one pad. Stuck it on my sole, went to sleep, and in the morning it peeled right off. No mess. I already told my sister to get a box.",
  },
  {
    name: "Omar",
    note: "Ordered 2 boxes",
    stars: 5,
    text: "The parcel actually arrived free. I opened it and counted ten pads in the box. I use one before bed now. Two boxes made more sense than buying again next week.",
  },
  {
    name: "Lina",
    note: "Ordered 1 box",
    stars: 4,
    text: "The pad is thin and it stays on. I press the center to my sole and leave it while I rest. Morning, peel, done. I took one star off only because I wanted the steps printed bigger on the box.",
  },
  {
    name: "Hassan",
    note: "Ordered 3 boxes",
    stars: 5,
    text: "I watched the video and ordered the same night. My wife uses one too. We peel, press, and forget it until morning. 99 for 30 pieces was the easy choice.",
  },
  {
    name: "Aisha",
    note: "Ordered 2 boxes",
    stars: 5,
    text: "Honestly I thought it would slip off. It didn't. White pad, dark center, stuck to the sole the whole night. I keep the second box in the drawer so I don't run out.",
  },
  {
    name: "Yusuf",
    note: "Ordered 1 box",
    stars: 5,
    text: "Don't overthink it. One pad, sole, sleep. I took it off with my coffee. Delivery was free and the box was Kinoki, same as the picture.",
  },
];

export const GALLERY = [
  {
    type: "image",
    src: "/images/desc/hands-product.jpg",
    alt: "Hands holding a Kinoki Cleansing Detox Foot Pads box and one adhesive pad.",
  },
  {
    type: "video",
    src: "/videos/foot-pads-overview.mp4",
    alt: "Video showing the Kinoki foot pad on the sole.",
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
    type: "video",
    src: "/videos/foot-pads-offer.mp4",
    alt: "Video showing the Kinoki box offer.",
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
