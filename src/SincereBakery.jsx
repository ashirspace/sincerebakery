import { useState, useEffect, useRef } from "react";

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

:root {
  --cream: #FFF8F0;
  --warm-white: #FFFDFB;
  --butter: #F5E6C8;
  --caramel: #C8956C;
  --chocolate: #5C3D2E;
  --espresso: #3A2218;
  --rose: #E8B4A2;
  --sage: #A8B89C;
  --gold: #D4A855;
  --light-gold: #F0DFB4;
  --text-primary: #2D1B12;
  --text-secondary: #6B5244;
  --text-light: #9C8577;
  --bg-primary: #FFF8F0;
  --bg-card: #FFFFFF;
  --shadow-sm: 0 2px 8px rgba(92, 61, 46, 0.06);
  --shadow-md: 0 8px 30px rgba(92, 61, 46, 0.08);
  --shadow-lg: 0 20px 60px rgba(92, 61, 46, 0.12);
  --radius: 16px;
  --radius-sm: 10px;
  --radius-lg: 24px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--text-primary);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: var(--butter);
  color: var(--espresso);
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--cream); }
::-webkit-scrollbar-thumb { background: var(--caramel); border-radius: 4px; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}

@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  30% { transform: translate(3%, -15%); }
  50% { transform: translate(12%, 9%); }
  70% { transform: translate(9%, 4%); }
  90% { transform: translate(-1%, 7%); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.grain-overlay {
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  animation: grain 8s steps(10) infinite;
  pointer-events: none;
  z-index: 1000;
  opacity: 0.4;
}
`;

const BAKERY_ITEMS = [
  {
    category: "Breads",
    emoji: "🍞",
    items: [
      { name: "Sourdough Loaf", price: "₹180", desc: "24-hour fermented, crispy crust", tag: "Bestseller" },
      { name: "Multigrain Bread", price: "₹150", desc: "7 grains, seeds & honey", tag: "" },
      { name: "Garlic Focaccia", price: "₹200", desc: "Rosemary, olive oil, sea salt", tag: "New" },
      { name: "Brioche Buns (4pc)", price: "₹220", desc: "Buttery, golden, pillowy soft", tag: "" },
    ],
  },
  {
    category: "Cakes",
    emoji: "🎂",
    items: [
      { name: "Belgian Chocolate Cake", price: "₹850", desc: "Triple layer, ganache frosting", tag: "Bestseller" },
      { name: "Red Velvet Cake", price: "₹750", desc: "Cream cheese frosting, velvet crumb", tag: "" },
      { name: "Fresh Fruit Cake", price: "₹700", desc: "Seasonal fruits, whipped cream", tag: "" },
      { name: "Butterscotch Cake", price: "₹650", desc: "Caramel drizzle, crunchy praline", tag: "Popular" },
    ],
  },
  {
    category: "Pastries",
    emoji: "🥐",
    items: [
      { name: "Butter Croissant", price: "₹120", desc: "36 layers of flaky perfection", tag: "Bestseller" },
      { name: "Almond Danish", price: "₹140", desc: "Frangipane, toasted almonds", tag: "" },
      { name: "Chocolate Eclair", price: "₹130", desc: "Choux, custard, dark chocolate", tag: "New" },
      { name: "Cinnamon Roll", price: "₹150", desc: "Swirled spice, cream cheese glaze", tag: "" },
    ],
  },
  {
    category: "Cookies & More",
    emoji: "🍪",
    items: [
      { name: "Chunky Choco Chip (6pc)", price: "₹250", desc: "Gooey center, crispy edges", tag: "Popular" },
      { name: "Almond Biscotti (8pc)", price: "₹200", desc: "Twice-baked, perfect with chai", tag: "" },
      { name: "Macarons Box (6pc)", price: "₹350", desc: "Assorted flavors, melt-in-mouth", tag: "New" },
      { name: "Brownie Slab", price: "₹180", desc: "Fudgy, walnut-loaded, sinful", tag: "Bestseller" },
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    text: "Sincere Bakery ka sourdough toh ekdum next level hai! Har weekend order karte hain. Family ko bahut pasand aata hai.",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Rahul Mehra",
    text: "Beti ki birthday ke liye chocolate cake order kiya tha — sab mehmaano ne tareef ki. Ab toh hamesha yahin se mangwate hain!",
    rating: 5,
    avatar: "RM",
  },
  {
    name: "Anita Gupta",
    text: "Croissants itne flaky aur buttery hain ki Paris yaad aa jata hai. Best bakery in the area, no doubt!",
    rating: 5,
    avatar: "AG",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function AnimatedSection({ children, delay = 0, animation = "fadeInUp", style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `${animation} 0.8s ease ${delay}s both` : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Menu", href: "#menu" },
    { label: "About", href: "#about" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(255,248,240,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(200,149,108,0.15)" : "none",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <a href="#home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--caramel), var(--chocolate))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color: "#fff", fontFamily: "'Playfair Display', serif", fontWeight: 700,
            boxShadow: "0 4px 15px rgba(200,149,108,0.3)",
          }}>S</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--espresso)", lineHeight: 1.1 }}>
              Sincere
            </div>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--caramel)", fontWeight: 600 }}>
              Bakery
            </div>
          </div>
        </a>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}
          className="nav-desktop"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                textDecoration: "none",
                padding: "8px 18px",
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 500,
                color: activeSection === l.href.slice(1) ? "var(--espresso)" : "var(--text-secondary)",
                background: activeSection === l.href.slice(1) ? "var(--butter)" : "transparent",
                transition: "all 0.3s ease",
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#menu"
            style={{
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(135deg, var(--caramel), var(--chocolate))",
              boxShadow: "0 4px 20px rgba(200,149,108,0.35)",
              marginLeft: 8,
              transition: "all 0.3s ease",
            }}
          >
            Order Now
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            flexDirection: "column",
            gap: 5,
          }}
        >
          <span style={{ width: 24, height: 2, background: "var(--espresso)", borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
          <span style={{ width: 24, height: 2, background: "var(--espresso)", borderRadius: 2, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ width: 24, height: 2, background: "var(--espresso)", borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "rgba(255,248,240,0.98)", backdropFilter: "blur(20px)",
          padding: "20px 32px", display: "flex", flexDirection: "column", gap: 8,
          borderBottom: "1px solid rgba(200,149,108,0.15)",
          animation: "fadeIn 0.3s ease",
        }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: "none", padding: "12px 0",
                fontSize: 16, fontWeight: 500, color: "var(--text-primary)",
                borderBottom: "1px solid rgba(200,149,108,0.1)",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(245,230,200,0.6) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(232,180,162,0.2) 0%, transparent 50%),
          radial-gradient(ellipse at 60% 80%, rgba(168,184,156,0.15) 0%, transparent 50%),
          var(--cream)
        `,
      }}
    >
      {/* Decorative Elements */}
      <div style={{ position: "absolute", top: "10%", right: "5%", fontSize: 120, opacity: 0.07, animation: "float 6s ease-in-out infinite" }}>🥐</div>
      <div style={{ position: "absolute", bottom: "15%", left: "3%", fontSize: 100, opacity: 0.06, animation: "float 8s ease-in-out infinite 1s" }}>🍰</div>
      <div style={{ position: "absolute", top: "60%", right: "15%", fontSize: 80, opacity: 0.05, animation: "float 7s ease-in-out infinite 2s" }}>🍞</div>

      {/* Pattern dots */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "radial-gradient(circle, rgba(200,149,108,0.07) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 32px 80px", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 720 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 20px", borderRadius: 100,
            background: "rgba(212,168,85,0.12)", border: "1px solid rgba(212,168,85,0.25)",
            marginBottom: 28,
            animation: "fadeInUp 0.8s ease both",
          }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--caramel)", letterSpacing: 1, textTransform: "uppercase" }}>
              Freshly Baked Every Morning
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(42px, 6vw, 76px)",
            fontWeight: 700,
            lineHeight: 1.08,
            color: "var(--espresso)",
            marginBottom: 24,
            animation: "fadeInUp 0.8s ease 0.15s both",
          }}>
            Baked with{" "}
            <span style={{
              fontStyle: "italic",
              background: "linear-gradient(135deg, var(--caramel), var(--gold))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Love
            </span>
            ,<br />
            Served with{" "}
            <span style={{
              fontStyle: "italic",
              background: "linear-gradient(135deg, var(--chocolate), var(--caramel))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Sincerity
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(18px, 2.5vw, 24px)",
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: 540,
            marginBottom: 40,
            animation: "fadeInUp 0.8s ease 0.3s both",
          }}>
            From our ovens to your doorstep — artisan breads, decadent cakes, flaky pastries
            and handcrafted treats delivered fresh across the city.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", animation: "fadeInUp 0.8s ease 0.45s both" }}>
            <a href="#menu" style={{
              textDecoration: "none",
              padding: "16px 36px",
              borderRadius: 100,
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(135deg, var(--caramel), var(--chocolate))",
              boxShadow: "0 8px 30px rgba(200,149,108,0.35)",
              transition: "all 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}>
              Explore Menu
              <span style={{ fontSize: 18 }}>→</span>
            </a>
            <a href="#contact" style={{
              textDecoration: "none",
              padding: "16px 36px",
              borderRadius: 100,
              fontSize: 16,
              fontWeight: 600,
              color: "var(--chocolate)",
              background: "rgba(255,255,255,0.7)",
              border: "1.5px solid rgba(200,149,108,0.3)",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
            }}>
              Custom Order
            </a>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 48, marginTop: 56, flexWrap: "wrap",
            animation: "fadeInUp 0.8s ease 0.6s both",
          }}>
            {[
              { num: "15+", label: "Years of Baking" },
              { num: "50+", label: "Signature Items" },
              { num: "10K+", label: "Happy Customers" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "var(--caramel)",
                  lineHeight: 1,
                }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-light)", marginTop: 4, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <svg style={{ position: "absolute", bottom: -2, left: 0, width: "100%", height: 80 }} viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="var(--cream)" />
      </svg>
    </section>
  );
}

/* ─── Features Strip ─── */
function FeaturesStrip() {
  const features = [
    { icon: "🌾", title: "100% Fresh", desc: "Baked fresh every single morning" },
    { icon: "🚚", title: "Free Delivery", desc: "On orders above ₹500" },
    { icon: "🎨", title: "Custom Cakes", desc: "Design your dream cake" },
    { icon: "💯", title: "Pure Ingredients", desc: "No preservatives, ever" },
  ];

  return (
    <section style={{ padding: "60px 0", background: "var(--cream)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 24,
        }}>
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "24px 28px",
                borderRadius: "var(--radius)",
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid rgba(200,149,108,0.08)",
                transition: "all 0.3s ease",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(245,230,200,0.7), rgba(232,180,162,0.3))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: "var(--espresso)", marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-light)" }}>{f.desc}</div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Menu ─── */
function Menu() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="menu" style={{ padding: "100px 0 80px", background: "var(--cream)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase",
              color: "var(--caramel)", marginBottom: 12,
            }}>
              Our Menu
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              color: "var(--espresso)",
              marginBottom: 16,
            }}>
              Freshly Crafted <span style={{ fontStyle: "italic", color: "var(--caramel)" }}>Delights</span>
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 19,
              color: "var(--text-secondary)",
              maxWidth: 500,
              margin: "0 auto",
            }}>
              Every item is made from scratch with the finest ingredients, baked to perfection
            </p>
          </div>
        </AnimatedSection>

        {/* Category Tabs */}
        <AnimatedSection delay={0.1}>
          <div style={{
            display: "flex", justifyContent: "center", gap: 8, marginBottom: 48,
            flexWrap: "wrap",
          }}>
            {BAKERY_ITEMS.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                style={{
                  padding: "12px 28px",
                  borderRadius: 100,
                  border: "1.5px solid",
                  borderColor: activeCategory === i ? "var(--caramel)" : "rgba(200,149,108,0.2)",
                  background: activeCategory === i
                    ? "linear-gradient(135deg, var(--caramel), var(--chocolate))"
                    : "var(--bg-card)",
                  color: activeCategory === i ? "#fff" : "var(--text-secondary)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: activeCategory === i ? "0 4px 20px rgba(200,149,108,0.3)" : "var(--shadow-sm)",
                }}
              >
                <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                {cat.category}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Items Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {BAKERY_ITEMS[activeCategory].items.map((item, i) => (
            <AnimatedSection key={`${activeCategory}-${i}`} delay={i * 0.08} animation="scaleIn">
              <div style={{
                padding: 28,
                borderRadius: "var(--radius)",
                background: "var(--bg-card)",
                border: "1px solid rgba(200,149,108,0.08)",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(200,149,108,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                {/* Tag */}
                {item.tag && (
                  <span style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    padding: "4px 12px",
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    background: item.tag === "New"
                      ? "linear-gradient(135deg, var(--sage), #7a9a6e)"
                      : item.tag === "Bestseller"
                        ? "linear-gradient(135deg, var(--gold), var(--caramel))"
                        : "linear-gradient(135deg, var(--rose), var(--caramel))",
                    color: "#fff",
                  }}>
                    {item.tag}
                  </span>
                )}

                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: `linear-gradient(135deg, rgba(245,230,200,0.5), rgba(232,180,162,0.2))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, marginBottom: 20,
                }}>
                  {BAKERY_ITEMS[activeCategory].emoji}
                </div>

                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 19,
                  fontWeight: 600,
                  color: "var(--espresso)",
                  marginBottom: 6,
                }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 20, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--caramel)",
                  }}>
                    {item.price}
                  </span>
                  <button style={{
                    padding: "8px 20px",
                    borderRadius: 100,
                    border: "1.5px solid var(--caramel)",
                    background: "transparent",
                    color: "var(--caramel)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--caramel)";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--caramel)";
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  return (
    <section id="about" style={{
      padding: "100px 0",
      background: `
        linear-gradient(180deg, var(--cream) 0%, rgba(245,230,200,0.3) 50%, var(--cream) 100%)
      `,
      position: "relative",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
          className="about-grid"
        >
          {/* Left — Image placeholder */}
          <AnimatedSection animation="slideInLeft">
            <div style={{
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              position: "relative",
              aspectRatio: "4/5",
              background: `
                linear-gradient(135deg, var(--butter) 0%, var(--rose) 50%, var(--light-gold) 100%)
              `,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-lg)",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 100, marginBottom: 16, animation: "breathe 4s ease infinite" }}>🧑‍🍳</div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "var(--espresso)",
                  opacity: 0.6,
                }}>
                  Est. 2009
                </div>
              </div>
              {/* Floating badge */}
              <div style={{
                position: "absolute", bottom: 24, right: 24,
                padding: "16px 24px",
                borderRadius: "var(--radius)",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "var(--shadow-md)",
                animation: "float 5s ease-in-out infinite",
              }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "var(--caramel)" }}>15+</div>
                <div style={{ fontSize: 12, color: "var(--text-light)", fontWeight: 500 }}>Years of Trust</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right — Text */}
          <AnimatedSection animation="slideInRight" delay={0.2}>
            <div>
              <div style={{
                fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase",
                color: "var(--caramel)", marginBottom: 12,
              }}>
                Our Story
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 3.5vw, 42px)",
                fontWeight: 700,
                color: "var(--espresso)",
                lineHeight: 1.2,
                marginBottom: 24,
              }}>
                A Family Tradition of{" "}
                <span style={{ fontStyle: "italic", color: "var(--caramel)" }}>Sincere</span>{" "}
                Baking
              </h2>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                lineHeight: 1.8,
                color: "var(--text-secondary)",
              }}>
                <p style={{ marginBottom: 20 }}>
                  What started as a small neighbourhood bakery in 2009 has grown into a beloved
                  brand trusted by thousands of families. At Sincere Bakery, every recipe carries
                  the warmth of home and the precision of a master baker.
                </p>
                <p style={{ marginBottom: 20 }}>
                  We source the finest flour, real butter, farm-fresh eggs, and premium chocolate
                  — because great baking starts with great ingredients. No shortcuts, no
                  preservatives, just honest food made with care.
                </p>
                <p>
                  From birthday cakes that make wishes come true to the daily bread that brings
                  families together — we bake every item as if it's for our own family.
                </p>
              </div>

              {/* Values */}
              <div style={{ display: "flex", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
                {[
                  { icon: "🌿", label: "No Preservatives" },
                  { icon: "🧈", label: "Real Butter" },
                  { icon: "❤️", label: "Made with Love" },
                ].map((v, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 20px",
                    borderRadius: 100,
                    background: "var(--bg-card)",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid rgba(200,149,108,0.1)",
                  }}>
                    <span style={{ fontSize: 18 }}>{v.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--espresso)" }}>{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  return (
    <section id="reviews" style={{ padding: "100px 0", background: "var(--cream)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase",
              color: "var(--caramel)", marginBottom: 12,
            }}>
              Testimonials
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              color: "var(--espresso)",
            }}>
              What Our <span style={{ fontStyle: "italic", color: "var(--caramel)" }}>Customers</span> Say
            </h2>
          </div>
        </AnimatedSection>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <div style={{
                padding: 32,
                borderRadius: "var(--radius)",
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid rgba(200,149,108,0.08)",
                transition: "all 0.35s ease",
                height: "100%",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Stars */}
                <div style={{ marginBottom: 16, fontSize: 16, letterSpacing: 2 }}>
                  {"★".repeat(t.rating)}
                </div>

                {/* Quote */}
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  marginBottom: 24,
                  fontStyle: "italic",
                }}>
                  "{t.text}"
                </p>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--butter), var(--rose))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 15, fontWeight: 700, color: "var(--espresso)",
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--espresso)" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-light)" }}>Regular Customer</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ─── */
function CTABanner() {
  return (
    <section style={{ padding: "80px 0", background: "var(--cream)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <AnimatedSection>
          <div style={{
            borderRadius: "var(--radius-lg)",
            padding: "clamp(40px, 6vw, 80px)",
            background: "linear-gradient(135deg, var(--espresso) 0%, var(--chocolate) 60%, var(--caramel) 100%)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative */}
            <div style={{ position: "absolute", top: "10%", left: "5%", fontSize: 80, opacity: 0.08 }}>🎂</div>
            <div style={{ position: "absolute", bottom: "10%", right: "5%", fontSize: 70, opacity: 0.08 }}>🍰</div>

            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 16,
              }}>
                Got a Special Occasion?
              </h2>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                color: "rgba(255,255,255,0.75)",
                maxWidth: 500,
                margin: "0 auto 36px",
              }}>
                Custom cakes, bulk orders, event catering — we've got you covered.
                Let's create something special together!
              </p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" style={{
                  textDecoration: "none",
                  padding: "16px 36px",
                  borderRadius: 100,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--espresso)",
                  background: "#fff",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}>
                  <span style={{ fontSize: 20 }}>💬</span>
                  WhatsApp Us
                </a>
                <a href="tel:+919999999999" style={{
                  textDecoration: "none",
                  padding: "16px 36px",
                  borderRadius: 100,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#fff",
                  background: "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(10px)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}>
                  <span style={{ fontSize: 18 }}>📞</span>
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  const [formState, setFormState] = useState({ name: "", phone: "", message: "" });

  return (
    <section id="contact" style={{
      padding: "100px 0 80px",
      background: `linear-gradient(180deg, var(--cream) 0%, rgba(245,230,200,0.4) 100%)`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase",
              color: "var(--caramel)", marginBottom: 12,
            }}>
              Get in Touch
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              color: "var(--espresso)",
            }}>
              Let's <span style={{ fontStyle: "italic", color: "var(--caramel)" }}>Connect</span>
            </h2>
          </div>
        </AnimatedSection>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
        }}
          className="contact-grid"
        >
          {/* Form */}
          <AnimatedSection animation="slideInLeft" delay={0.1}>
            <div style={{
              padding: 40,
              borderRadius: "var(--radius-lg)",
              background: "var(--bg-card)",
              boxShadow: "var(--shadow-md)",
              border: "1px solid rgba(200,149,108,0.08)",
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24,
                fontWeight: 600,
                color: "var(--espresso)",
                marginBottom: 28,
              }}>
                Send us a Message
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { key: "name", label: "Your Name", placeholder: "e.g. Rahul Sharma", type: "text" },
                  { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formState[field.key]}
                      onChange={(e) => setFormState({ ...formState, [field.key]: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "14px 20px",
                        borderRadius: "var(--radius-sm)",
                        border: "1.5px solid rgba(200,149,108,0.2)",
                        background: "var(--cream)",
                        fontSize: 15,
                        color: "var(--text-primary)",
                        outline: "none",
                        transition: "border-color 0.3s",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "var(--caramel)"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(200,149,108,0.2)"}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us about your order or query..."
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "14px 20px",
                      borderRadius: "var(--radius-sm)",
                      border: "1.5px solid rgba(200,149,108,0.2)",
                      background: "var(--cream)",
                      fontSize: 15,
                      color: "var(--text-primary)",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--caramel)"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(200,149,108,0.2)"}
                  />
                </div>
                <button style={{
                  padding: "16px 36px",
                  borderRadius: 100,
                  border: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#fff",
                  background: "linear-gradient(135deg, var(--caramel), var(--chocolate))",
                  boxShadow: "0 6px 25px rgba(200,149,108,0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Send Message →
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Info */}
          <AnimatedSection animation="slideInRight" delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                {
                  icon: "📍",
                  title: "Visit Our Bakery",
                  lines: ["Sincere Bakery", "Shop No. 12, Main Market Road", "Your City — 110001"],
                },
                {
                  icon: "🕐",
                  title: "Opening Hours",
                  lines: ["Monday – Saturday: 7:00 AM – 9:00 PM", "Sunday: 8:00 AM – 8:00 PM"],
                },
                {
                  icon: "📞",
                  title: "Call / WhatsApp",
                  lines: ["+91 99999 99999", "+91 88888 88888"],
                },
                {
                  icon: "📧",
                  title: "Email",
                  lines: ["orders@sincerebakery.in", "info@sincerebakery.in"],
                },
              ].map((info, i) => (
                <div key={i} style={{
                  padding: 28,
                  borderRadius: "var(--radius)",
                  background: "var(--bg-card)",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid rgba(200,149,108,0.08)",
                  display: "flex",
                  gap: 20,
                  transition: "all 0.3s ease",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: "linear-gradient(135deg, rgba(245,230,200,0.6), rgba(232,180,162,0.2))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "var(--espresso)", marginBottom: 6 }}>
                      {info.title}
                    </div>
                    {info.lines.map((line, j) => (
                      <div key={j} style={{ fontSize: 14, color: "var(--text-light)", lineHeight: 1.6 }}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{
      padding: "60px 0 32px",
      background: "var(--espresso)",
      color: "rgba(255,255,255,0.7)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
          marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--caramel), var(--gold))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, color: "#fff", fontFamily: "'Playfair Display', serif", fontWeight: 700,
              }}>S</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>Sincere</div>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--caramel)" }}>Bakery</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Baking happiness since 2009. Fresh, honest, and always made with love.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
              Quick Links
            </div>
            {["Home", "Menu", "About", "Reviews", "Contact"].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} style={{
                display: "block", textDecoration: "none", color: "rgba(255,255,255,0.6)",
                fontSize: 14, padding: "6px 0", transition: "color 0.3s",
              }}
                onMouseEnter={(e) => e.target.style.color = "var(--caramel)"}
                onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.6)"}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Social */}
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
              Follow Us
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "IG", color: "#E1306C" },
                { label: "FB", color: "#1877F2" },
                { label: "YT", color: "#FF0000" },
              ].map((s, i) => (
                <div key={i} style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          fontSize: 13,
        }}>
          <div>© 2024 Sincere Bakery. All rights reserved.</div>
          <div style={{ color: "rgba(255,255,255,0.4)" }}>
            Crafted with ❤️ and flour
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main App ─── */
export default function SincereBakery() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const sections = ["home", "menu", "about", "reviews", "contact"];
    const handler = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <div className="grain-overlay" />
      <Navbar activeSection={activeSection} />
      <Hero />
      <FeaturesStrip />
      <Menu />
      <About />
      <Testimonials />
      <CTABanner />
      <Contact />
      <Footer />
    </div>
  );
}
