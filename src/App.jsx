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
  WHATSAPP_DISPLAY,
  WHATSAPP_LINK,
  formatPrice,
} from "./data/product";
import { trackInitiateCheckout, trackOrder, trackViewContent } from "./pixel";

const DELIVERIES = [{ id: "home", label: "Cash on delivery", icon: "cod" }];

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
  const cityRef = useRef(null);
  const [comboIndex, setComboIndex] = useState(1);
  const [delivery] = useState("home");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [toast, setToast] = useState("");
  const [showSticky, setShowSticky] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  const combo = COMBOS[comboIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => setWhatsAppOpen(true), 900);
    return () => window.clearTimeout(timer);
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

  useEffect(() => {
    trackViewContent({ price: COMBOS[1]?.price || 119 });
  }, []);

  function scrollToOrder() {
    trackInitiateCheckout({
      price: combo.price,
      quantity: combo.quantity,
      comboId: combo.id,
    });
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    });
    setSubmitting(false);
    setToast(result.message);
    if (result.ok) {
      trackOrder({
        name: recipient,
        mobile,
        city: city.trim(),
        price: combo.price,
        quantity: combo.quantity,
        comboId: combo.id,
      });
      setName("");
      setPhone("");
      setCity("");
    }
  }

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
          <span>4 boxes SAR 119 · 8 boxes SAR 149</span>
        </p>
        <div className="pharmacy-actions">
          <button type="button" className="pharmacy-primary" ref={heroCtaRef} onClick={scrollToOrder}>
            Shop now
          </button>
          <a className="pharmacy-secondary" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
            WhatsApp
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

      <Reviews onShop={scrollToOrder} />

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
                className={`ship ship-${item.icon} is-selected`}
                aria-pressed="true"
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="delivery-note">
          <img src="/images/jt-express.png" alt="J&T Express" width="537" height="98" />
        </p>

        <button type="submit" className="place-order" disabled={submitting}>
          {submitting ? "Checking order…" : "Submit my details"}
        </button>
      </form>

      <OrderConfirm onShop={scrollToOrder} />

      <Returns />

      <footer className="site-footer">
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
            <span className="order-now-brand">Sara Al-Fahad</span>
            <span className="order-now-label">Order now</span>
          </button>
        </div>
      )}

      {whatsAppOpen && (
        <div className="whatsapp-notice" role="dialog" aria-modal="true" aria-label="WhatsApp notice">
          <button
            type="button"
            className="whatsapp-notice-backdrop"
            aria-label="Close WhatsApp notice"
            onClick={() => setWhatsAppOpen(false)}
          />
          <div className="whatsapp-pop">
            <button
              type="button"
              className="whatsapp-close"
              aria-label="Close WhatsApp popup"
              onClick={() => setWhatsAppOpen(false)}
            >
              ×
            </button>
            <p className="whatsapp-pop-kicker">Customer notice</p>
            <p className="whatsapp-pop-title">Message us on WhatsApp</p>
            <p className="whatsapp-pop-copy">Need help with your order? Chat with us now.</p>
            <p className="whatsapp-pop-number">{WHATSAPP_DISPLAY}</p>
            <a className="whatsapp-pop-btn" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
              Open WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className={showSticky ? "whatsapp-dock is-raised" : "whatsapp-dock"}>
        <a
          className="message-us"
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          aria-label="Message us on WhatsApp"
          onClick={(event) => {
            event.preventDefault();
            setWhatsAppOpen(true);
          }}
        >
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.01 3C9.39 3 4 8.34 4 14.9c0 2.1.56 4.14 1.62 5.95L4 29l8.36-2.18A12.1 12.1 0 0 0 16.01 27C22.63 27 28 21.66 28 15.1S22.63 3 16.01 3zm0 21.9c-1.8 0-3.56-.48-5.1-1.4l-.37-.21-4.96 1.29 1.33-4.8-.24-.39A9.7 9.7 0 0 1 6.1 14.9c0-5.4 4.45-9.8 9.91-9.8s9.91 4.4 9.91 9.8-4.45 9.8-9.91 9.8zm5.44-7.34c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.45-2.38-1.45-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.57-.49-.49-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1-1.04 2.46s1.06 2.85 1.21 3.05c.15.2 2.09 3.16 5.06 4.43.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.71 2.01-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35z"
            />
          </svg>
        </a>
      </div>

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
        Warm reminder. Once your details are filled in, tap Confirm placing an order. That counts as a complete order.
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

function Reviews({ onShop }) {
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
      <button type="button" className="buy-now reviews-cta" onClick={onShop}>
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
        <span>4 boxes SAR 119</span>
        <span>8 boxes SAR 149</span>
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
