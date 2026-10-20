import { useEffect, useMemo, useRef, useState } from "react";
import { submitOrder } from "./checkout";
import { placeName } from "./data/places";
import {
  COMBOS,
  GALLERY,
  HEADLINE,
  HERO_OLD_PRICE,
  HERO_PRICE,
  LEAD,
  REVIEWS,
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
  const heroCtaRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const [comboIndex, setComboIndex] = useState(2);
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
  const [showSticky, setShowSticky] = useState(false);
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
      const order = orderRef.current;
      const heroCta = heroCtaRef.current;
      if (!order) return;
      const orderReached = order.getBoundingClientRect().top < window.innerHeight;
      const heroBox = heroCta?.getBoundingClientRect();
      const heroCtaVisible = Boolean(
        heroBox && heroBox.bottom > 0 && heroBox.top < window.innerHeight,
      );
      setShowSticky(!orderReached && !heroCtaVisible);
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
      currency: "AED",
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
          alt="A woman holding a mint-green box of Mild Care Foot Pads toward the camera."
          width="750"
          height="750"
        />
        <div className="hero-accent" />
      </section>

      <section className="summary" aria-labelledby="product-title">
        <div className="price-row">
          <div className="price-main">
            <span className="final-price">{HERO_PRICE}</span>
            {HERO_OLD_PRICE ? <span className="old-price">{HERO_OLD_PRICE}</span> : null}
          </div>
          <div className="price-badges">
            <span className="badge">Free delivery</span>
            <span className="badge">10 pieces</span>
          </div>
        </div>
        <h1 id="product-title" className="product-title">
          <span className="badge badge-time">Free delivery</span> {HEADLINE}
        </h1>
        <p className="lead">{LEAD}</p>
        <ul className="perks">
          <li>
            <CheckIcon />
            Free delivery
          </li>
          <li>
            <CheckIcon />
            Herbal and gentle
          </li>
          <li>
            <CheckIcon />
            Apply to the sole while you rest
          </li>
        </ul>
        <button type="button" className="buy-now" ref={heroCtaRef} onClick={scrollToOrder}>
          <CartIcon />
          <span>Send my details</span>
        </button>
      </section>

      <div className="divider" />

      <section className="description" aria-labelledby="description-title">
        <h2 id="description-title">Product description</h2>
        <GuaranteeBanner />
        <SalesBanner />
        <OriginBanner />
        <BenefitsBanner />
        {GALLERY.map((block, index) =>
          block.type === "video" ? (
            <video
              key={block.src}
              src={block.src}
              controls
              playsInline
              muted
              loop
              preload="metadata"
              aria-label={block.alt}
            />
          ) : (
            <img
              key={block.src}
              src={block.src}
              alt={block.alt}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
            />
          ),
        )}
        <QuestionBanner />
        <ComplicationBanner />
        <DailyCupBanner />
        <ProductSpecs />
      </section>

      <Reviews />

      <form id="order-box" ref={orderRef} className="order" onSubmit={onSubmit} noValidate>
        <h2>Leave your details</h2>
        <p className="order-note">Choose a box, then send your name and phone. Delivery is free.</p>
        <div className="order-product">
          <img src="/images/desc/order-box.jpg" alt="" width="100" height="100" />
          <p>
            <strong>{SHORT_NAME}</strong>
            <br />
            {LEAD}
          </p>
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
          {submitting ? "Checking order…" : "Submit my details"}
        </button>
      </form>

      <footer className="site-footer">
        <p>Copyright © 2024 All Rights Reserved</p>
      </footer>

      {showSticky && (
        <div className="sticky-buy">
          <button type="button" onClick={scrollToOrder}>
            <CartIcon />
            Send my details
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

function Reviews() {
  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title">Customer feedback</h2>
      <p className="reviews-intro">Notes from people who ordered the pads.</p>
      <ul>
        {REVIEWS.map((review) => (
          <li key={review.name}>
            <p className="stars" aria-label={`${review.stars} out of 5 stars`}>
              {"★".repeat(review.stars)}
              {"☆".repeat(5 - review.stars)}
            </p>
            <blockquote>{review.text}</blockquote>
            <p className="reviewer">{review.name}</p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="buy-now reviews-cta"
        onClick={() => document.getElementById("order-box")?.scrollIntoView({ behavior: "smooth", block: "start" })}
      >
        Get free delivery
      </button>
    </section>
  );
}

function GuaranteeBanner() {
  return (
    <figure className="banner banner-guarantee">
      <div className="seal" aria-hidden="true">
        <span>Satisfaction</span>
        <strong>Free delivery on every box</strong>
        <span>Included</span>
      </div>
      <p className="banner-headline">Order and we deliver it free</p>
      <figcaption>
        <span className="protect-mark">Herbal pad</span>
        100% herbal and gentle ingredients, 10 pieces in each box
      </figcaption>
    </figure>
  );
}

function SalesBanner() {
  return (
    <figure className="banner banner-sales">
      <p className="sales-kicker">Box prices</p>
      <p className="sales-number">
        99<span> AED</span>
      </p>
      <p className="sales-highlight">3 boxes, 30 pieces — the lowest price in the offer</p>
      <p className="sales-pill">
        <span>1 box 50</span>
        <span>2 boxes 80</span>
      </p>
    </figure>
  );
}

function BenefitsBanner() {
  const items = [
    ["Deep cleansing", "Marketed as a detox foot patch that absorbs impurities through the sole."],
    ["Circulation and metabolism", "The box says it improves blood circulation and metabolism."],
    ["Fluids and toxins", "Described as removing excess fluids and toxins."],
    ["Fatigue and stress", "Described as relieving fatigue and stress."],
    ["Sleep and relaxation", "Described as promoting healthy sleep and relaxation."],
    ["Pain and swelling", "Described as helping relieve pain and swelling."],
  ];
  return (
    <section className="benefits" aria-label="What the foot pad packaging says">
      <h3>What the packaging says</h3>
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
  return <p className="red-banner">This patch can absorb dirt on your body</p>;
}

function ComplicationBanner() {
  return (
    <p className="yellow-banner">
      An affordable Ayurvedic remedy for <mark>obesity and impurities in the body</mark>
    </p>
  );
}

function DailyCupBanner() {
  return (
    <section className="daily-cup">
      <p>Place it on the sole. Leave it on while you rest.</p>
      <p>
        Peel the white pad, press the <mark>dark herbal center</mark> to the sole, and remove it in the morning.
      </p>
      <p>Your body will thank you.</p>
    </section>
  );
}

function ProductSpecs() {
  const rows = [
    ["Product name", "Mild Care Foot Pads"],
    ["Type", "Deep-cleansing detox foot patch"],
    ["Contents", "10 pieces per box"],
    ["Formula", "100% herbal and gentle ingredients"],
    ["How to use", "Stick the pad on the sole and leave it on while you rest"],
    ["Prices", "1 box AED 50, 2 boxes AED 80, 3 boxes AED 99"],
  ];
  return (
    <section className="specs" aria-label="Product information">
      <h3>Product information</h3>
      <p>Foot pad details</p>
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
      Mild Care Foot Pads — <mark>deep-cleansing detoxify foot patch</mark>
    </p>
  );
}
