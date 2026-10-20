import { useEffect, useRef, useState } from "react";
import { submitOrder } from "./checkout";
import {
  CERTIFICATES,
  COMBOS,
  DEMO_ADDRESS,
  GALLERY,
  HEADLINE,
  HERO_PRICE,
  NOTICES,
  PHARMACY_NAME,
  LEAD,
  RETURN_POLICY,
  REVIEWS,
  SHORT_NAME,
  formatPrice,
} from "./data/product";

const HOME_NOTE =
  "Note: We will deliver the parcel to your home. Please watch for it.";
const HOME_NOTE_AGAIN =
  "Note: T-Cat or Hsinchu Logistics will deliver to your home. Leave a message if you want a specific carrier.";
const STORE_NOTE =
  "Note: Write your city and the store address. You will need to pick the parcel up yourself.";

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

export default function App() {
  const orderRef = useRef(null);
  const heroCtaRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const [comboIndex, setComboIndex] = useState(1);
  const [delivery, setDelivery] = useState("home");
  const [homeClicks, setHomeClicks] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [toast, setToast] = useState("");
  const [showSticky, setShowSticky] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const combo = COMBOS[comboIndex];
  const isStore = delivery === "seven" || delivery === "family";

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
    setCity("");
    setAddress("");
    if (next === "home") setHomeClicks((count) => count + 1);
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
    if (!city.trim()) {
      showMessage("Please enter your city", cityRef.current);
      return;
    }
    if (!address.trim()) {
      showMessage("Please complete the delivery address", addressRef.current);
      return;
    }

    setSubmitting(true);
    const result = await submitOrder({
      product: SHORT_NAME,
      comboId: combo.id,
      quantity: combo.quantity,
      price: combo.price,
      currency: "SAR",
      name: recipient,
      mobile,
      delivery,
      city: city.trim(),
      address: address.trim(),
    });
    setSubmitting(false);
    setToast(result.message);
  }

  const note = isStore ? STORE_NOTE : homeClicks > 0 ? HOME_NOTE_AGAIN : HOME_NOTE;
  const addressPlaceholder = isStore
    ? "Street, and the store name if you want pickup"
    : "Enter your full address so the courier can reach you";

  return (
    <>
      <a className="skip-link" href="#order-box">
        Skip to order form
      </a>

      <section className="pharmacy-hero" aria-labelledby="product-title">
        <div className="pharmacy-bar">
          <span className="pharmacy-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <rect x="10" y="3" width="4" height="18" rx="1" />
              <rect x="3" y="10" width="18" height="4" rx="1" />
            </svg>
          </span>
          <p>{PHARMACY_NAME}</p>
          <span className="pharmacy-chip">Free delivery</span>
        </div>
        <div className="pharmacy-stage">
          <img
            className="pharmacy-main"
            src="/images/hero.jpg"
            alt="A pharmacist in a bright pharmacy holding a Kinoki box and a foot pad out toward the camera."
            width="900"
            height="1200"
          />
        </div>
        <p className="pharmacy-kicker">Cleansing detox foot pads</p>
        <h1 id="product-title">{HEADLINE}</h1>
        <p className="pharmacy-lead">{LEAD}</p>
        <p className="pharmacy-price">
          <strong>{HERO_PRICE}</strong>
          <span>4 boxes · 8 boxes SAR 149</span>
        </p>
        <div className="pharmacy-actions">
          <button type="button" className="pharmacy-primary" ref={heroCtaRef} onClick={scrollToOrder}>
            Shop now
          </button>
          <a className="pharmacy-secondary" href="https://lin.ee/QXp84HX" target="_blank" rel="noreferrer">
            Message us
          </a>
        </div>
        <ul className="pharmacy-trust">
          <li>10 pads in every box</li>
          <li>Cash on delivery</li>
          <li>Ask us before you order</li>
        </ul>
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

      <Certificates />

      <section className="wear-banner">
        <img src="/images/desc/pads-on-soles.jpg" alt="Both soles wearing Kinoki foot pads." width="900" height="900" />
        <button type="button" className="shop-now" onClick={scrollToOrder}>
          Shop now
        </button>
      </section>

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

        <div className="lead-fields">
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
              Mobile number
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

          <label className="field">
            <span className="field-label">
              <abbr className="req" title="required">
                *
              </abbr>
              City
            </span>
            <input
              ref={cityRef}
              name="city"
              autoComplete="address-level2"
              placeholder="Type your city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
            />
          </label>
        </div>

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

        <button type="submit" className="place-order" disabled={submitting}>
          {submitting ? "Checking order…" : "Submit my details"}
        </button>
      </form>

      <OrderConfirm onShop={scrollToOrder} />

      <Returns />

      <footer className="site-footer">
        <p className="demo-note">{DEMO_ADDRESS.note}</p>
        <address>
          <strong>{DEMO_ADDRESS.name}</strong>
          {DEMO_ADDRESS.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </address>
        <p>Copyright © 2024 All Rights Reserved</p>
      </footer>

      {showSticky && (
        <div className="sticky-buy">
          <button type="button" className="order-now" onClick={scrollToOrder}>
            <span className="order-now-brand">Safa Care</span>
            <span className="order-now-label">Order now</span>
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

function OrderConfirm({ onShop }) {
  const loop = [...NOTICES, ...NOTICES];
  return (
    <section className="order-confirm" aria-labelledby="confirm-title">
      <p id="confirm-title" className="warm-reminder">
        Warm reminder. Once your address is filled in, tap Confirm placing an order. That counts as a complete order.
      </p>
      <button type="submit" form="order-box" className="confirm-order">
        <span aria-hidden="true">🪙</span>
        Confirm placing an order
        <span aria-hidden="true">🪙</span>
      </button>
      <button type="button" className="notice-shop" onClick={onShop}>
        <CartIcon />
        Shop now
      </button>
      <div className="purchase-notices">
        <p className="demo-note">Demo notices for this presentation.</p>
        <div className="notice-window">
          <ul className="notice-track">
            {loop.map((text, index) => (
              <li key={`${text}-${index}`}>{text}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Returns() {
  return (
    <section className="returns" aria-labelledby="returns-title">
      <h2 id="returns-title">What you need to know about returns and exchanges</h2>
      <ol>
        {RETURN_POLICY.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </section>
  );
}

function Certificates() {
  return (
    <section className="certificates" aria-labelledby="certificates-title">
      <h2 id="certificates-title">Certificates</h2>
      <ul>
        {CERTIFICATES.map((item) => (
          <li key={item.src}>
            <img src={item.src} alt={item.alt} width="640" height="840" />
            <p>{item.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Reviews() {
  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title">What people are saying</h2>
      <p className="reviews-intro">Messages from people who ordered a box.</p>
      <ul>
        {REVIEWS.map((review) => (
          <li key={review.name}>
            <div className="review-head">
              <img className="avatar" src={review.photo} alt="" width="52" height="52" />
              <div>
                <p className="reviewer">{review.name}</p>
                <p className="review-note">{review.note}</p>
              </div>
              <p className="stars" aria-label={`${review.stars} out of 5 stars`}>
                {"★".repeat(review.stars)}
                {"☆".repeat(5 - review.stars)}
              </p>
            </div>
            <blockquote>{review.text}</blockquote>
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
        <span className="protect-mark">Kinoki</span>
        Cleansing detox foot pads, 10 pieces in each box
      </figcaption>
    </figure>
  );
}

function SalesBanner() {
  return (
    <figure className="banner banner-sales">
      <p className="sales-kicker">Box prices</p>
      <p className="sales-number">
        149<span> SAR</span>
      </p>
      <p className="sales-highlight">8 boxes — the lowest price in the offer</p>
      <p className="sales-pill">
        <span>4 boxes 119</span>
        <span>8 boxes 149</span>
      </p>
    </figure>
  );
}

function BenefitsBanner() {
  const items = [
    ["Suck", "Bamboo vinegar extract, shown absorbing impurities."],
    ["Row", "Cyclic adsorption of impurities."],
    ["Clear", "Described as cleansing body impurities."],
    ["On the sole", "The pad sits on the sole while you rest."],
  ];
  return (
    <section className="benefits" aria-label="Benefits">
      <h3>Benefits</h3>
      <img src="/images/desc/benefit-steps.jpg" alt="Three panels labeled Suck, Row, and Clear." />
      <img src="/images/desc/benefit-packs.jpg" alt="Two Kinoki packs next to four white foot pads." />
      <img src="/images/desc/benefit-soles.jpg" alt="Both soles wearing Kinoki foot pads." />
      <img src="/images/desc/benefit-map.jpg" alt="Product display of the soles with labeled points." />
      <video
        src="/videos/benefit-video.mp4"
        controls
        playsInline
        preload="metadata"
        aria-label="Benefit video for Kinoki foot pads"
      />
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
  return <p className="red-banner">Cleanse and energize your body</p>;
}

function ComplicationBanner() {
  return (
    <p className="yellow-banner">
      Kinoki pads for the soles — <mark>10 pieces in every box</mark>
    </p>
  );
}

function DailyCupBanner() {
  return (
    <section className="daily-cup">
      <p>Place it on the sole. Leave it on while you rest.</p>
      <p>
        Peel the white pad, press the <mark>center onto the sole</mark>, and remove it in the morning.
      </p>
      <p>Your body will thank you.</p>
    </section>
  );
}

function ProductSpecs() {
  const rows = [
    ["Product name", "Kinoki Cleansing Detox Foot Pads"],
    ["Type", "Cleansing detox foot pads"],
    ["Contents", "10 pieces per box"],
    ["How to use", "Stick the pad on the sole and leave it on while you rest"],
    ["Prices", "4 boxes SAR 119, 8 boxes SAR 149"],
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
      Kinoki — <mark>Cleansing Detox Foot Pads</mark>
    </p>
  );
}
