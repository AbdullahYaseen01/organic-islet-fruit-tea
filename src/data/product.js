export const SHORT_NAME = "Mild Care Foot Pads";

export const HEADLINE = "Mild Care Foot Pads";

export const LEAD =
  "A deep-cleansing herbal foot patch. Press it on the sole before you rest. Each box has 10 pieces, and delivery is free.";

export const PRODUCT_NAME =
  "Mild Care Foot Pads. The packaging says this detox foot patch quickly absorbs toxins and impurities, with 100% herbal and gentle ingredients. It is described as supporting circulation and metabolism, easing fatigue, and helping you rest. 10 pieces per box.";

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
    text: "I stick the pad on before bed. It stays put, and it peels off easily in the morning.",
  },
  {
    name: "Omar",
    stars: 5,
    text: "The box came with free delivery. Ten pads was enough for me to try a full round.",
  },
  {
    name: "Lina",
    stars: 4,
    text: "It feels gentle on the skin. I liked that the box describes the formula as herbal.",
  },
  {
    name: "Hassan",
    stars: 5,
    text: "I took the two-box offer. The pads are simple to use and the price for 20 pieces made sense.",
  },
];

export const GALLERY = [
  {
    type: "image",
    src: "/images/desc/hands-product.jpg",
    alt: "Hands holding a Mild Care Foot Pads box and one adhesive pad.",
  },
  {
    type: "image",
    src: "/images/desc/two-boxes.jpg",
    alt: "Two boxes of Mild Care Foot Pads on a cream background.",
  },
  {
    type: "image",
    src: "/images/desc/boxes-studio.jpg",
    alt: "A single Mild Care Foot Pads box in a studio shot.",
  },
  {
    type: "image",
    src: "/images/desc/pad-closeup.jpg",
    alt: "Close-up of the white foot pad and its dark herbal center.",
  },
  {
    type: "image",
    src: "/images/desc/apply-sole.jpg",
    alt: "The pad being pressed onto the sole of a foot.",
  },
  {
    type: "image",
    src: "/images/desc/herbs-box.jpg",
    alt: "Herbal ingredients arranged with a Mild Care Foot Pads box.",
  },
  {
    type: "image",
    src: "/images/desc/how-to-use.jpg",
    alt: "Three steps for peeling, placing, and removing the pad.",
  },
  {
    type: "image",
    src: "/images/desc/used-pad.jpg",
    alt: "A used foot pad showing a darkened center.",
  },
  {
    type: "image",
    src: "/images/desc/morning-tray.jpg",
    alt: "A morning tray with the foot-pad box and fresh pads.",
  },
  {
    type: "video",
    src: "/videos/foot-pads-overview.mp4",
    alt: "Video showing how the foot pad is applied.",
  },
  {
    type: "video",
    src: "/videos/foot-pads-offer.mp4",
    alt: "Video showing the AED 50, 80, and 99 box prices.",
  },
];

export function formatPrice(amount) {
  return `AED ${Number(amount).toFixed(2)}`;
}
