export const PRODUCT_NAME =
  "Blood-sugar tea, “Organic Islet Fruit Tea.” Helps lower blood sugar, supports immunity, aids digestion, helps balance blood lipids, clears heat and cools the blood, and reduces swelling. Natural insulin — Islet Fruit Tea. It promotes insulin secretion, increases the body’s sensitivity to insulin, regulates gut microbes, supports intestinal health, helps prevent constipation, limits toxic fermentation byproducts, protects the liver, helps prevent colon cancer, and is a dietary drink for obesity. Drinking it regularly can address high blood sugar, high blood pressure, and high blood lipids. An organic formula from Taiwan, for a better constitution with a daily cup.";

export const SHORT_NAME = "Organic Islet Fruit Tea";

export const HERO_PRICE = "NT$998.00";
export const HERO_OLD_PRICE = "NT$ 1598.00";

export const COMBOS = [
  {
    id: "894235",
    quantity: 8,
    price: 1650,
    label:
      "90% of customers choose “Natural antioxidants, helps with diabetes, clears waste from blood vessels” 8-pack — NT$1650",
  },
  {
    id: "894236",
    quantity: 4,
    price: 1250,
    label:
      "“Numb hands and feet, dizziness — two cups a day, a help for diabetes” 4-pack — NT$1250",
  },
  {
    id: "894237",
    quantity: 2,
    price: 1050,
    label: "“New — try Organic Islet Fruit Tea” 2-pack — NT$1050",
  },
  {
    id: "894238",
    quantity: 6,
    price: 1450,
    label:
      "“Helps clear liver toxins and lower blood pressure and blood sugar” 6-pack — NT$1450",
  },
  {
    id: "894239",
    quantity: 12,
    price: 1898,
    label:
      "Limited-time offer “Helps control blood sugar and the three highs” 12-pack — NT$1898",
  },
];

const GIF_NUMBERS = new Set([12, 15, 19, 22, 23, 24, 34]);
const REPLACED = new Set([9, 11, 14, 18, 49]);

const IMAGE_ALTS = {
  5: "Chiayi Farm entrance. The sign includes the English words Land of Wonder; the large characters are still Chinese.",
  6: "Freshly harvested yacon roots. A Chinese news-agency watermark remains in the corner.",
  8: "Two people harvesting tubers in a dry field.",
};

function imageBlock(number) {
  const ext = GIF_NUMBERS.has(number) ? "gif" : "jpg";
  return {
    type: "image",
    src: `/images/desc/${String(number).padStart(2, "0")}.${ext}`,
    alt:
      IMAGE_ALTS[number] ||
      "Scene from the product description. Any writing embedded in this image is still in Chinese.",
  };
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
    if (REPLACED.has(number)) return null;
    return imageBlock(number);
  }).filter(Boolean),
];

export function formatPrice(amount) {
  return `NT$${Number(amount).toFixed(2)}`;
}
