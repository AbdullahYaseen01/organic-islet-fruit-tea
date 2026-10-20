export const SHORT_NAME = "Kinoki Cleansing Detox Foot Pads";

export const HEADLINE = "Kinoki Cleansing Detox Foot Pads";

export const LEAD =
  "Stick a pad on each sole before you rest. The box says cleanse and energize your body. Each box has 10 pieces, and delivery is free.";

export const PRODUCT_NAME =
  "Kinoki Cleansing Detox Foot Pads. White adhesive pads for the soles, sold in boxes of 10. The packaging says cleanse and energize your body.";

export const PHARMACY_NAME = "Safa Care Pharmacy";

export const HERO_PRICE = "SAR 119";
export const HERO_OLD_PRICE = "";

export const COMBOS = [
  {
    id: "pack-4",
    quantity: 40,
    price: 119,
    label: "Pack of 4 boxes — SAR 119",
  },
  {
    id: "pack-8",
    quantity: 80,
    price: 149,
    label: "Best value · Pack of 8 boxes — SAR 149",
  },
];

export const REVIEWS = [
  {
    name: "Nadia",
    photo: "/images/reviews/nadia.jpg",
    note: "8:41 pm",
    stars: 5,
    text: "I almost skipped it. Then I stuck one pad on before sleep. In the morning I peeled it off in one pull. No mess on the sheet. I already sent this page to my sister.",
  },
  {
    name: "Omar",
    photo: "/images/reviews/omar.jpg",
    note: "10:16 pm",
    stars: 5,
    text: "The parcel showed up and delivery was actually free. I counted ten pads. I use one at night now. I took two boxes so I don't have to order again next week.",
  },
  {
    name: "Lina",
    photo: "/images/reviews/lina.jpg",
    note: "7:02 pm",
    stars: 4,
    text: "It stays put. Thin white pad, dark center, pressed on the sole. Morning, peel, done. Four stars only because the steps on the box are printed a bit small.",
  },
  {
    name: "Hassan",
    photo: "/images/reviews/hassan.jpg",
    note: "9:28 pm",
    stars: 5,
    text: "I watched the video and ordered the same night. My wife uses one too. We peel, press, and leave it till morning. SAR 149 for 8 boxes was the easy pick.",
  },
  {
    name: "Aisha",
    photo: "/images/reviews/aisha.jpg",
    note: "6:55 pm",
    stars: 5,
    text: "I really thought it would slide off. It didn't. It stayed on the sole the whole night. The second box is in the drawer so I don't run out.",
  },
  {
    name: "Yusuf",
    photo: "/images/reviews/yusuf.jpg",
    note: "11:20 pm",
    stars: 5,
    text: "One pad, sole, sleep. I took it off with my coffee. Delivery was free, and the box said Kinoki, same as the picture.",
  },
];

export const CERTIFICATES = [
  {
    src: "/images/certificates/quality.svg",
    alt: "Sample quality certificate for Kinoki Cleansing Detox Foot Pads, number SC-QA-1042.",
    title: "Quality",
  },
  {
    src: "/images/certificates/authenticity.svg",
    alt: "Sample authenticity certificate for Kinoki foot pads, number SC-AU-2088.",
    title: "Authenticity",
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
  return `SAR ${Number(amount).toFixed(2)}`;
}
