import { useEffect, useMemo, useRef, useState } from "react";
import { submitOrder } from "./checkout";
import { placeName } from "./data/places";
import {
  COMBOS,
  STORY,
  HERO_OLD_PRICE,
  HERO_PRICE,
  PRODUCT_NAME,
  SHORT_NAME,
  formatPrice,
} from "./data/product";

const HOME_NOTE =
  "Note: We will deliver the parcel to your home. Please watch for it.";
const HOME_NOTE_AGAIN =
  "Note: T-Cat or Hsinchu Logistics will deliver to your home. Leave a message if you want a specific carrier.";
const STORE_NOTE =
  "Note: The parcel will be held at the store you choose. You will need to pick it up yourself.";

const DELIVERIES = [
  { id: "home", label: "Cash on delivery", icon: "cod" },
  { id: "seven", label: "7-ELEVEN", icon: "seven" },
  { id: "family", label: "FamilyMart", icon: "family" },
];

function CartIcon() {
  return (
    <svg className="cart-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 18a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 18zm10 0a2 2 0 1 0 .001 4.001A2 2 0 0 0 17 18zM6.1 6l.7 2.2h12.4l-1.5 6.6H8.2L6.1 6zM4.8 4H2v2h1.7l1.8 6.2.6 2.3H19v-2H9.3l-.3-1h9.9l2.2-9.5H4.8z"
      />
    </svg>
  );
}

function CheckIcon() {
  return <img className="check-icon" src="/icons/check.svg" alt="" />;
}

export default function App() {
  const orderRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const [comboIndex, setComboIndex] = useState(0);
  const [delivery, setDelivery] = useState("home");
  const [homeClicks, setHomeClicks] = useState(0);
  const [regions, setRegions] = useState([]);
  const [regionsError, setRegionsError] = useState(false);
  const [countyId, setCountyId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [storeValue, setStoreValue] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [showSticky, setShowSticky] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const combo = COMBOS[comboIndex];
  const isStore = delivery === "seven" || delivery === "family";
  const storeType = delivery === "seven" ? "1" : delivery === "family" ? "2" : "";

  const county = useMemo(
    () => regions.find((item) => String(item.id) === String(countyId)),
    [regions, countyId],
  );
  const districts = county?.list ?? [];
  const district = districts.find((item) => String(item.id) === String(districtId));
  const stores = useMemo(() => {
    if (!isStore || !district) return [];
    return (district.city_store || []).filter((store) => String(store.type) === storeType);
  }, [district, isStore, storeType]);

  useEffect(() => {
    let active = true;
    fetch("/data/regions.json")
      .then((response) => {
        if (!response.ok) throw new Error("regions");
        return response.json();
      })
      .then((data) => {
        if (active) setRegions(data);
      })
      .catch(() => {
        if (active) setRegionsError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const node = orderRef.current;
      if (!node) return;
      setShowSticky(node.getBoundingClientRect().top >= window.innerHeight);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function scrollToOrder() {
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function chooseDelivery(next) {
    setDelivery(next);
    setCountyId("");
    setDistrictId("");
    setStoreValue("");
    setAddress("");
    if (next === "home") setHomeClicks((count) => count + 1);
  }

  function chooseCounty(value) {
    setCountyId(value);
    setDistrictId("");
    setStoreValue("");
    if (isStore) setAddress("");
  }

  function chooseDistrict(value) {
    setDistrictId(value);
    setStoreValue("");
    if (isStore) setAddress("");
  }

  function chooseStore(value) {
    setStoreValue(value);
    if (value) setAddress(value);
  }

  function showMessage(text, field) {
    setToast(text);
    field?.focus();
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const recipient = name.trim();
    if (!recipient) {
      showMessage("Please enter the recipient's name", nameRef.current);
      return;
    }
    const mobile = phone.trim().replace(/[+\-#*,./() \u202d]/g, "");
    if (!mobile) {
      showMessage("Please enter a contact mobile number", phoneRef.current);
      return;
    }
    if (!address.trim()) {
      showMessage(
        "Please complete the delivery address",
        isStore ? null : addressRef.current,
      );
      return;
    }

    setSubmitting(true);
    const result = await submitOrder({
      product: SHORT_NAME,
      comboId: combo.id,
      quantity: combo.quantity,
      price: combo.price,
      currency: "TWD",
      name: recipient,
      mobile,
      delivery,
      countyId,
      districtId,
      address: address.trim(),
      message: message.trim(),
    });
    setSubmitting(false);
    setToast(result.message);
  }

  const note = isStore ? STORE_NOTE : homeClicks > 0 ? HOME_NOTE_AGAIN : HOME_NOTE;
  const addressPlaceholder = isStore
    ? "Select a county, then a district, then a store"
    : "Enter your full address so the courier can reach you";

  return (
    <>
      <a className="skip-link" href="#order-box">
        Skip to order form
      </a>

      <section className="hero" aria-label="Product photo">
        <img
          src="/images/hero.jpg"
          alt="Promotional photo of Organic Islet Fruit Tea: a woman holds a jar of dried fruit beside a glass of tea. Chinese text is printed on this graphic and is not translated in the image itself."
          width="750"
          height="750"
        />
        <div className="hero-accent" />
      </section>

      <section className="summary" aria-labelledby="product-title">
        <div className="price-row">
          <div className="price-main">
            <span className="final-price">{HERO_PRICE}</span>
            <span className="old-price">{HERO_OLD_PRICE}</span>
          </div>
          <div className="price-badges">
            <span className="badge">Free shipping</span>
            <span className="badge">7-day appreciation</span>
          </div>
        </div>
        <h1 id="product-title" className="product-title">
          <span className="badge badge-time">Limited-time offer</span> {PRODUCT_NAME}
        </h1>
        <ul className="perks">
          <li>
            <CheckIcon />
            Cash on delivery
          </li>
          <li>
            <CheckIcon />
            Convenience-store pickup
          </li>
          <li>
            <CheckIcon />
            T-Cat / Hsinchu home delivery
          </li>
        </ul>
        <button type="button" className="buy-now" onClick={scrollToOrder}>
          <CartIcon />
          <span>Buy now</span>
        </button>
      </section>

      <div className="divider" />

      <section className="description" aria-labelledby="description-title">
        <h2 id="description-title">Product description</h2>
        {STORY.map((block, index) => {
          if (block.type === "guarantee") return <GuaranteeBanner key={block.type} />;
          if (block.type === "sales") return <SalesBanner key={block.type} />;
          if (block.type === "origin") return <OriginBanner key={block.type} />;
          if (block.type === "benefits") return <BenefitsBanner key={block.type} />;
          if (block.type === "question") return <QuestionBanner key={block.type} />;
          if (block.type === "complications") return <ComplicationBanner key={block.type} />;
          if (block.type === "daily") return <DailyCupBanner key={block.type} />;
          if (block.type === "specs") return <ProductSpecs key={block.type} />;
          return (
            <img key={block.src} src={block.src} alt={block.alt} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
          );
        })}
      </section>

      <form id="order-box" ref={orderRef} className="order" onSubmit={onSubmit} noValidate>
        <h2>Confirm your order</h2>
        <div className="order-product">
          <img src="/images/hero.jpg" alt="" width="100" height="100" />
          <p>{PRODUCT_NAME}</p>
        </div>

        <div className="combos" role="radiogroup" aria-label="Package">
          {COMBOS.map((item, index) => {
            const selected = index === comboIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={selected ? "combo is-selected" : "combo"}
                onClick={() => setComboIndex(index)}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="total-row">
          <span>Order total</span>
          <strong>{formatPrice(combo.price)}</strong>
        </div>

        <label className="field">
          <span className="field-label">
            <abbr className="req" title="required">
              *
            </abbr>
            Name
          </span>
          <input
            ref={nameRef}
            name="name"
            autoComplete="name"
            placeholder="Please enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">
            <abbr className="req" title="required">
              *
            </abbr>
            Mobile
          </span>
          <input
            ref={phoneRef}
            name="tel"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Please enter your mobile number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </label>

        <fieldset className="delivery">
          <legend>
            <abbr className="req" title="required">
              *
            </abbr>
            Delivery method
          </legend>
          <div className="delivery-options">
            {DELIVERIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={delivery === item.id ? `ship ship-${item.icon} is-selected` : `ship ship-${item.icon}`}
                aria-pressed={delivery === item.id}
                onClick={() => chooseDelivery(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="delivery-note">{note}</p>

        <label className="field">
          <span className="field-label">
            <abbr className="req" title="required">
              *
            </abbr>
            County
          </span>
          <select
            value={countyId}
            onChange={(event) => chooseCounty(event.target.value)}
            disabled={regions.length === 0}
          >
            <option value="">{regionsError ? "Areas could not be loaded" : "== Select a county or city =="}</option>
            {regions.map((item) => (
              <option key={item.id} value={item.id}>
                {placeName(item.title)}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">
            <abbr className="req" title="required">
              *
            </abbr>
            District
          </span>
          <select value={districtId} onChange={(event) => chooseDistrict(event.target.value)}>
            <option value="">== Select a district ==</option>
            {districts.map((item) => (
              <option key={item.id} value={item.id}>
                {placeName(item.title)}
              </option>
            ))}
          </select>
        </label>

        {isStore ? (
          <label className="field">
            <span className="field-label">
              <abbr className="req" title="required">
                *
              </abbr>
              Store
            </span>
            <select value={storeValue} onChange={(event) => chooseStore(event.target.value)}>
              {districtId && stores.length === 0 ? (
                <option value="">No stores in this area</option>
              ) : (
                <>
                  <option value="">== Select a store ==</option>
                  {stores.map((store) => {
                    const value = `${store.detail}, store: ${store.name}, store no. ${store.number}`;
                    return (
                      <option key={`${store.type}-${store.number}-${store.name}`} value={value}>
                        {store.name} — {store.detail}
                      </option>
                    );
                  })}
                </>
              )}
            </select>
          </label>
        ) : (
          <label className="field">
            <span className="field-label">
              <abbr className="req" title="required">
                *
              </abbr>
              Address
            </span>
            <input
              ref={addressRef}
              name="address"
              autoComplete="street-address"
              placeholder={addressPlaceholder}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
            />
          </label>
        )}

        <label className="field field-message">
          <span className="field-label">Message</span>
          <textarea
            name="message"
            placeholder="Leave a special request, or anything else you would like us to know"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>

        <button type="submit" className="place-order" disabled={submitting}>
          {submitting ? "Checking order…" : "Place order"}
        </button>
      </form>

      <footer className="site-footer">
        <p>Copyright © 2024 All Rights Reserved</p>
      </footer>

      {showSticky && (
        <div className="sticky-buy">
          <button type="button" onClick={scrollToOrder}>
            <CartIcon />
            Buy now
          </button>
        </div>
      )}

      <a
        className="message-us"
        href="https://lin.ee/QXp84HX"
        target="_blank"
        rel="noreferrer"
        aria-label="Message us on LINE"
      >
        LINE
      </a>

      {toast && (
        <div className="toast" role="alert">
          {toast}
        </div>
      )}
    </>
  );
}

function GuaranteeBanner() {
  return (
    <figure className="banner banner-guarantee">
      <div className="seal" aria-hidden="true">
        <span>Satisfaction</span>
        <strong>7-day returns, no questions asked</strong>
        <span>Guarantee</span>
      </div>
      <p className="banner-headline">Truly risk-free shopping</p>
      <figcaption>
        <span className="protect-mark">Consumer protection</span>
        This shop has joined Taiwan’s “Consumer Protection Plan”
      </figcaption>
    </figure>
  );
}

function SalesBanner() {
  return (
    <figure className="banner banner-sales">
      <p className="sales-kicker">Cumulative units sold</p>
      <p className="sales-number">
        150,000<span>+</span>
      </p>
      <p className="sales-highlight">A welcome bonus — if you get it, you gain!!</p>
      <p className="sales-pill">
        <span>Bestseller</span>
        <span>Limited-time offer</span>
      </p>
    </figure>
  );
}

function BenefitsBanner() {
  const items = [
    ["Regulate blood sugar", "Contains components similar to insulin, helps regulate blood sugar, and is called “natural insulin.”"],
    ["Improve blood lipids", "Helps lower cholesterol and reduce the risk of atherosclerosis."],
    ["Antioxidant", "Rich in polyphenols, vitamin C, and other antioxidants. Resists free radicals and slows aging."],
    ["Anti-inflammatory effect", "Has an anti-inflammatory effect that helps ease inflammation."],
    ["Aid digestion", "Promotes digestion and eases gastrointestinal discomfort."],
    ["Weight management", "Supports weight management."],
    ["Balance blood pressure", "Potassium helps the body clear excess sodium and eases the strain a high-salt diet puts on blood pressure."],
  ];
  return (
    <section className="benefits" aria-label="Core health benefits of islet fruit">
      <h3>Core health benefits of islet fruit</h3>
      <ol>
        {items.map(([title, copy]) => (
          <li key={title}>
            <strong>{title}</strong>
            <span>{copy}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function QuestionBanner() {
  return <p className="red-banner">How long has it been since you paid attention to your blood sugar?</p>;
}

function ComplicationBanner() {
  return (
    <p className="yellow-banner">
      The complications that follow are increasing, <mark>and they affect the whole body’s function</mark>
    </p>
  );
}

function DailyCupBanner() {
  return (
    <section className="daily-cup">
      <p>One cup a day. It dropped so fast.</p>
      <p>
        Traditional Chinese medicine practitioner Luo Mingyu recommended this <mark>islet fruit tea</mark> on a wellness program.
      </p>
      <p>Lowers blood sugar, relieves thirst, and works well for blood-sugar control.</p>
    </section>
  );
}

function ProductSpecs() {
  const rows = [
    ["Product name", "Islet Fruit Tea"],
    ["Flavor", "Original"],
    ["Net weight", "100 g"],
    ["Storage", "Keep in a cool, dry place"],
    ["Ingredients", "Islet fruit"],
    ["How to prepare", "Steep in boiling water"],
  ];
  return (
    <section className="specs" aria-label="Product information">
      <h3>Product information</h3>
      <p>Islet fruit and tea archives</p>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function OriginBanner() {
  return (
    <p className="origin-bar">
      Grown by the Chiayi Farmers’ Association: blood-sugar fruit —{" "}
      <mark>islet fruit</mark> (also known as yacon)
    </p>
  );
}
