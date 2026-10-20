export const PRODUCT_NAME =
  "Mild Care Foot Pads, a deep-cleansing detox foot patch. The box says it quickly absorbs toxins and impurities, with 100% herbal and gentle ingredients. It is described as improving blood circulation and metabolism, drawing away excess fluid and toxins, easing fatigue and stress, supporting healthy sleep and relaxation, and helping relieve pain and swelling. An affordable Ayurvedic foot pad for body impurities, 10 pieces per box.";

export const SHORT_NAME = "Mild Care Foot Pads";

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
    label: "3 boxes (30 pieces) — AED 99",
  },
];

const PHOTOS = [
  {
    src: "/images/desc/two-boxes.jpg",
    alt: "Two boxes of Mild Care Foot Pads, 10 pieces each.",
  },
  {
    src: "/images/desc/boxes-studio.jpg",
    alt: "A Mild Care Foot Pads box on a white background.",
  },
  {
    src: "/images/desc/pad-closeup.jpg",
    alt: "A white adhesive foot pad with a dark herbal center.",
  },
  {
    src: "/images/desc/apply-sole.jpg",
    alt: "A foot pad being pressed onto the sole of a foot.",
  },
  {
    src: "/images/desc/herbs-box.jpg",
    alt: "Herbal ingredients displayed with a Mild Care Foot Pads box.",
  },
  {
    src: "/images/desc/how-to-use.jpg",
    alt: "How to use the pad: peel it, place it on the sole, then remove it.",
  },
  {
    src: "/images/desc/used-pad.jpg",
    alt: "A used foot pad with a darkened center.",
  },
];

const VIDEOS = [
  {
    src: "/videos/foot-pads-overview.mp4",
    poster: "/images/desc/pad-closeup.jpg",
    alt: "Video showing the foot pads and how the patch is applied.",
  },
  {
    src: "/videos/foot-pads-offer.mp4",
    poster: "/images/desc/two-boxes.jpg",
    alt: "Video showing the 50, 80, and 99 AED box prices.",
  },
];

const VIDEO_SLOTS = new Set([12, 15, 19, 22, 23, 24, 34]);
const TEXT_SLOTS = new Set([9, 11, 14, 18, 49]);

function mediaBlock(number) {
  if (VIDEO_SLOTS.has(number)) {
    const video = VIDEOS[[...VIDEO_SLOTS].indexOf(number) % VIDEOS.length];
    return { type: "video", ...video };
  }
  const photo = PHOTOS[(number - 5) % PHOTOS.length];
  return { type: "image", ...photo };
}

export const STORY = [
  { type: "guarantee" },
  { type: "sales" },
  { type: "origin" },
  ...Array.from({ length: 45 }, (_, index) => {
    const number = index + 5;
    if (number === 9) return { type: "benefits" };
    if (number === 11) return { type: "question" };
    if (number === 14) return { type: "complications" };
    if (number === 18) return { type: "daily" };
    if (number === 49) return { type: "specs" };
    if (TEXT_SLOTS.has(number)) return null;
    return mediaBlock(number);
  }).filter(Boolean),
];

export function formatPrice(amount) {
  return `AED ${Number(amount).toFixed(2)}`;
}
