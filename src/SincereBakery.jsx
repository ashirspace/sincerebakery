import { useState, useEffect, useRef } from "react";

// ─── CONFIG ───
const OWNER_WHATSAPP = "919999999999"; // <-- APNA WHATSAPP NUMBER DAAL (country code ke saath, no +)

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

::selection { background: var(--butter); color: var(--espresso); }
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
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
@keyframes cartBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-4px); }
}
@keyframes checkmark {
  0% { transform: scale(0) rotate(-45deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(0deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.grain-overlay {
  position: fixed; top: -50%; left: -50%; right: -50%; bottom: -50%;
  width: 200%; height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  animation: grain 8s steps(10) infinite;
  pointer-events: none; z-index: 1000; opacity: 0.4;
}
`;

const BAKERY_ITEMS = [
  {
    category: "Breads", emoji: "🍞",
    items: [
      { id: "b1", name: "Sourdough Loaf", price: 180, desc: "24-hour fermented, crispy crust", tag: "Bestseller" },
      { id: "b2", name: "Multigrain Bread", price: 150, desc: "7 grains, seeds & honey", tag: "" },
      { id: "b3", name: "Garlic Focaccia", price: 200, desc: "Rosemary, olive oil, sea salt", tag: "New" },
      { id: "b4", name: "Brioche Buns (4pc)", price: 220, desc: "Buttery, golden, pillowy soft", tag: "" },
    ],
  },
  {
    category: "Cakes", emoji: "🎂",
    items: [
      { id: "c1", name: "Belgian Chocolate Cake", price: 850, desc: "Triple layer, ganache frosting", tag: "Bestseller" },
      { id: "c2", name: "Red Velvet Cake", price: 750, desc: "Cream cheese frosting, velvet crumb", tag: "" },
      { id: "c3", name: "Fresh Fruit Cake", price: 700, desc: "Seasonal fruits, whipped cream", tag: "" },
      { id: "c4", name: "Butterscotch Cake", price: 650, desc: "Caramel drizzle, crunchy praline", tag: "Popular" },
    ],
  },
  {
    category: "Pastries", emoji: "🥐",
    items: [
      { id: "p1", name: "Butter Croissant", price: 120, desc: "36 layers of flaky perfection", tag: "Bestseller" },
      { id: "p2", name: "Almond Danish", price: 140, desc: "Frangipane, toasted almonds", tag: "" },
      { id: "p3", name: "Chocolate Eclair", price: 130, desc: "Choux, custard, dark chocolate", tag: "New" },
      { id: "p4", name: "Cinnamon Roll", price: 150, desc: "Swirled spice, cream cheese glaze", tag: "" },
    ],
  },
  {
    category: "Cookies & More", emoji: "🍪",
    items: [
      { id: "k1", name: "Chunky Choco Chip (6pc)", price: 250, desc: "Gooey center, crispy edges", tag: "Popular" },
      { id: "k2", name: "Almond Biscotti (8pc)", price: 200, desc: "Twice-baked, perfect with chai", tag: "" },
      { id: "k3", name: "Macarons Box (6pc)", price: 350, desc: "Assorted flavors, melt-in-mouth", tag: "New" },
      { id: "k4", name: "Brownie Slab", price: 180, desc: "Fudgy, walnut-loaded, sinful", tag: "Bestseller" },
    ],
  },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", text: "Sincere Bakery ka sourdough toh ekdum next level hai! Har weekend order karte hain.", rating: 5, avatar: "PS" },
  { name: "Rahul Mehra", text: "Beti ki birthday ke liye chocolate cake order kiya tha — sab mehmaano ne tareef ki.", rating: 5, avatar: "RM" },
  { name: "Anita Gupta", text: "Croissants itne flaky aur buttery hain ki Paris yaad aa jata hai. Best bakery!", rating: 5, avatar: "AG" },
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
    <div ref={ref} style={{ opacity: inView ? 1 : 0, animation: inView ? `${animation} 0.8s ease ${delay}s both` : "none", ...style }}>
      {children}
    </div>
  );
}

function Navbar({ activeSection, cartCount, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const links = [
    { label: "Home", href: "#home" }, { label: "Menu", href: "#menu" },
    { label: "About", href: "#about" }, { label: "Reviews", href: "#reviews" }, { label: "Contact", href: "#contact" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      padding: scrolled ? "12px 0" : "20px 0",
      background: scrolled ? "rgba(255,248,240,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
      borderBottom: scrolled ? "1px solid rgba(200,149,108,0.15)" : "none",
      transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="#home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--caramel), var(--chocolate))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", fontFamily: "'Playfair Display', serif", fontWeight: 700, boxShadow: "0 4px 15px rgba(200,149,108,0.3)" }}>S</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--espresso)", lineHeight: 1.1 }}>Sincere</div>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--caramel)", fontWeight: 600 }}>Bakery</div>
          </div>
        </a>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="nav-desktop">
          {links.map((l) => (
            <a key={l.label} href={l.href} style={{ textDecoration: "none", padding: "8px 18px", borderRadius: 100, fontSize: 14, fontWeight: 500, color: activeSection === l.href.slice(1) ? "var(--espresso)" : "var(--text-secondary)", background: activeSection === l.href.slice(1) ? "var(--butter)" : "transparent", transition: "all 0.3s ease" }}>{l.label}</a>
          ))}
          <button onClick={onCartClick} style={{ position: "relative", padding: "10px 20px", borderRadius: 100, border: "1.5px solid rgba(200,149,108,0.3)", background: "var(--bg-card)", color: "var(--chocolate)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
            <span style={{ fontSize: 18 }}>🛒</span>Cart
            {cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #e74c3c, #c0392b)", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", animation: "pop 0.3s ease", boxShadow: "0 2px 8px rgba(231,76,60,0.4)" }}>{cartCount}</span>}
          </button>
          <a href="#menu" style={{ textDecoration: "none", padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, var(--caramel), var(--chocolate))", boxShadow: "0 4px 20px rgba(200,149,108,0.35)", marginLeft: 4 }}>Order Now</a>
        </div>
        <div style={{ display: "none", alignItems: "center", gap: 12 }} className="nav-mobile-area">
          <button onClick={onCartClick} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 24, padding: 4 }}>
            🛒
            {cartCount > 0 && <span style={{ position: "absolute", top: -4, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#e74c3c", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "flex", background: "none", border: "none", cursor: "pointer", padding: 8, flexDirection: "column", gap: 5 }}>
            <span style={{ width: 24, height: 2, background: "var(--espresso)", borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
            <span style={{ width: 24, height: 2, background: "var(--espresso)", borderRadius: 2, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ width: 24, height: 2, background: "var(--espresso)", borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(255,248,240,0.98)", backdropFilter: "blur(20px)", padding: "20px 32px", display: "flex", flexDirection: "column", gap: 8, borderBottom: "1px solid rgba(200,149,108,0.15)", animation: "fadeIn 0.3s ease" }}>
          {links.map((l) => (<a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", padding: "12px 0", fontSize: 16, fontWeight: 500, color: "var(--text-primary)", borderBottom: "1px solid rgba(200,149,108,0.1)" }}>{l.label}</a>))}
        </div>
      )}
      <style>{`@media (max-width: 768px) { .nav-desktop { display: none !important; } .nav-mobile-area { display: flex !important; } }`}</style>
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 20% 50%, rgba(245,230,200,0.6) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(232,180,162,0.2) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(168,184,156,0.15) 0%, transparent 50%), var(--cream)" }}>
      <div style={{ position: "absolute", top: "10%", right: "5%", fontSize: 120, opacity: 0.07, animation: "float 6s ease-in-out infinite" }}>🥐</div>
      <div style={{ position: "absolute", bottom: "15%", left: "3%", fontSize: 100, opacity: 0.06, animation: "float 8s ease-in-out infinite 1s" }}>🍰</div>
      <div style={{ position: "absolute", top: "60%", right: "15%", fontSize: 80, opacity: 0.05, animation: "float 7s ease-in-out infinite 2s" }}>🍞</div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle, rgba(200,149,108,0.07) 1px, transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 32px 80px", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 100, background: "rgba(212,168,85,0.12)", border: "1px solid rgba(212,168,85,0.25)", marginBottom: 28, animation: "fadeInUp 0.8s ease both" }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--caramel)", letterSpacing: 1, textTransform: "uppercase" }}>Freshly Baked Every Morning</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 6vw, 76px)", fontWeight: 700, lineHeight: 1.08, color: "var(--espresso)", marginBottom: 24, animation: "fadeInUp 0.8s ease 0.15s both" }}>
            Baked with <span style={{ fontStyle: "italic", background: "linear-gradient(135deg, var(--caramel), var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Love</span>,<br />
            Served with <span style={{ fontStyle: "italic", background: "linear-gradient(135deg, var(--chocolate), var(--caramel))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sincerity</span>
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px, 2.5vw, 24px)", lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 540, marginBottom: 40, animation: "fadeInUp 0.8s ease 0.3s both" }}>
            From our ovens to your doorstep — artisan breads, decadent cakes, flaky pastries and handcrafted treats delivered fresh across the city.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", animation: "fadeInUp 0.8s ease 0.45s both" }}>
            <a href="#menu" style={{ textDecoration: "none", padding: "16px 36px", borderRadius: 100, fontSize: 16, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, var(--caramel), var(--chocolate))", boxShadow: "0 8px 30px rgba(200,149,108,0.35)", display: "inline-flex", alignItems: "center", gap: 10 }}>Explore Menu <span style={{ fontSize: 18 }}>→</span></a>
            <a href="#contact" style={{ textDecoration: "none", padding: "16px 36px", borderRadius: 100, fontSize: 16, fontWeight: 600, color: "var(--chocolate)", background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(200,149,108,0.3)", backdropFilter: "blur(10px)" }}>Custom Order</a>
          </div>
          <div style={{ display: "flex", gap: 48, marginTop: 56, flexWrap: "wrap", animation: "fadeInUp 0.8s ease 0.6s both" }}>
            {[{ num: "15+", label: "Years of Baking" }, { num: "50+", label: "Signature Items" }, { num: "10K+", label: "Happy Customers" }].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "var(--caramel)", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "var(--text-light)", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <svg style={{ position: "absolute", bottom: -2, left: 0, width: "100%", height: 80 }} viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="var(--cream)" />
      </svg>
    </section>
  );
}

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 28px", borderRadius: "var(--radius)", background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid rgba(200,149,108,0.08)" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, rgba(245,230,200,0.7), rgba(232,180,162,0.3))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{f.icon}</div>
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

function Menu({ cart, onAddToCart, onRemoveFromCart }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const getItemQty = (id) => { const item = cart.find((c) => c.id === id); return item ? item.qty : 0; };

  return (
    <section id="menu" style={{ padding: "100px 0 80px", background: "var(--cream)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--caramel)", marginBottom: 12 }}>Our Menu</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "var(--espresso)", marginBottom: 16 }}>Freshly Crafted <span style={{ fontStyle: "italic", color: "var(--caramel)" }}>Delights</span></h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>Every item is made from scratch with the finest ingredients</p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48, flexWrap: "wrap" }}>
            {BAKERY_ITEMS.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)} style={{ padding: "12px 28px", borderRadius: 100, border: "1.5px solid", borderColor: activeCategory === i ? "var(--caramel)" : "rgba(200,149,108,0.2)", background: activeCategory === i ? "linear-gradient(135deg, var(--caramel), var(--chocolate))" : "var(--bg-card)", color: activeCategory === i ? "#fff" : "var(--text-secondary)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: activeCategory === i ? "0 4px 20px rgba(200,149,108,0.3)" : "var(--shadow-sm)", transition: "all 0.3s ease" }}>
                <span style={{ fontSize: 18 }}>{cat.emoji}</span>{cat.category}
              </button>
            ))}
          </div>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {BAKERY_ITEMS[activeCategory].items.map((item, i) => {
            const qty = getItemQty(item.id);
            return (
              <AnimatedSection key={`${activeCategory}-${i}`} delay={i * 0.08} animation="scaleIn">
                <div style={{ padding: 28, borderRadius: "var(--radius)", background: "var(--bg-card)", border: qty > 0 ? "2px solid var(--caramel)" : "1px solid rgba(200,149,108,0.08)", boxShadow: "var(--shadow-sm)", transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(200,149,108,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
                  {item.tag && <span style={{ position: "absolute", top: 16, right: 16, padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: item.tag === "New" ? "linear-gradient(135deg, var(--sage), #7a9a6e)" : item.tag === "Bestseller" ? "linear-gradient(135deg, var(--gold), var(--caramel))" : "linear-gradient(135deg, var(--rose), var(--caramel))", color: "#fff" }}>{item.tag}</span>}
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, rgba(245,230,200,0.5), rgba(232,180,162,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 20 }}>{BAKERY_ITEMS[activeCategory].emoji}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 600, color: "var(--espresso)", marginBottom: 6 }}>{item.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 20, lineHeight: 1.5 }}>{item.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--caramel)" }}>₹{item.price}</span>
                    {qty === 0 ? (
                      <button onClick={() => onAddToCart(item, activeCategory)} style={{ padding: "8px 20px", borderRadius: 100, border: "1.5px solid var(--caramel)", background: "transparent", color: "var(--caramel)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.3s ease" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--caramel)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--caramel)"; }}>Add to Cart</button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--butter)", borderRadius: 100, padding: "4px 8px" }}>
                        <button onClick={() => onRemoveFromCart(item.id)} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "var(--bg-card)", color: "var(--chocolate)", fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)" }}>−</button>
                        <span style={{ fontWeight: 700, fontSize: 16, color: "var(--espresso)", minWidth: 20, textAlign: "center" }}>{qty}</span>
                        <button onClick={() => onAddToCart(item, activeCategory)} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "linear-gradient(135deg, var(--caramel), var(--chocolate))", color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(200,149,108,0.3)" }}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" style={{ padding: "100px 0", background: "linear-gradient(180deg, var(--cream) 0%, rgba(245,230,200,0.3) 50%, var(--cream) 100%)", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="about-grid">
          <AnimatedSection animation="slideInLeft">
            <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", position: "relative", aspectRatio: "4/5", background: "linear-gradient(135deg, var(--butter) 0%, var(--rose) 50%, var(--light-gold) 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-lg)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 100, marginBottom: 16, animation: "breathe 4s ease infinite" }}>🧑‍🍳</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, color: "var(--espresso)", opacity: 0.6 }}>Est. 2009</div>
              </div>
              <div style={{ position: "absolute", bottom: 24, right: 24, padding: "16px 24px", borderRadius: "var(--radius)", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", boxShadow: "var(--shadow-md)", animation: "float 5s ease-in-out infinite" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "var(--caramel)" }}>15+</div>
                <div style={{ fontSize: 12, color: "var(--text-light)", fontWeight: 500 }}>Years of Trust</div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="slideInRight" delay={0.2}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--caramel)", marginBottom: 12 }}>Our Story</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, color: "var(--espresso)", lineHeight: 1.2, marginBottom: 24 }}>A Family Tradition of <span style={{ fontStyle: "italic", color: "var(--caramel)" }}>Sincere</span> Baking</h2>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, lineHeight: 1.8, color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: 20 }}>What started as a small neighbourhood bakery in 2009 has grown into a beloved brand trusted by thousands of families.</p>
                <p style={{ marginBottom: 20 }}>We source the finest flour, real butter, farm-fresh eggs, and premium chocolate — because great baking starts with great ingredients.</p>
                <p>From birthday cakes that make wishes come true to the daily bread that brings families together — we bake every item as if it's for our own family.</p>
              </div>
              <div style={{ display: "flex", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
                {[{ icon: "🌿", label: "No Preservatives" }, { icon: "🧈", label: "Real Butter" }, { icon: "❤️", label: "Made with Love" }].map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 100, background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid rgba(200,149,108,0.1)" }}>
                    <span style={{ fontSize: 18 }}>{v.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--espresso)" }}>{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="reviews" style={{ padding: "100px 0", background: "var(--cream)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--caramel)", marginBottom: 12 }}>Testimonials</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "var(--espresso)" }}>What Our <span style={{ fontStyle: "italic", color: "var(--caramel)" }}>Customers</span> Say</h2>
          </div>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <div style={{ padding: 32, borderRadius: "var(--radius)", background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid rgba(200,149,108,0.08)", transition: "all 0.35s ease", height: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ marginBottom: 16, fontSize: 16, letterSpacing: 2, color: "var(--gold)" }}>{"★".repeat(t.rating)}</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--butter), var(--rose))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "var(--espresso)" }}>{t.avatar}</div>
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

function CTABanner() {
  return (
    <section style={{ padding: "80px 0", background: "var(--cream)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <AnimatedSection>
          <div style={{ borderRadius: "var(--radius-lg)", padding: "clamp(40px, 6vw, 80px)", background: "linear-gradient(135deg, var(--espresso) 0%, var(--chocolate) 60%, var(--caramel) 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "10%", left: "5%", fontSize: 80, opacity: 0.08 }}>🎂</div>
            <div style={{ position: "absolute", bottom: "10%", right: "5%", fontSize: 70, opacity: 0.08 }}>🍰</div>
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", marginBottom: 16 }}>Got a Special Occasion?</h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "rgba(255,255,255,0.75)", maxWidth: 500, margin: "0 auto 36px" }}>Custom cakes, bulk orders, event catering — we've got you covered.</p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <a href={`https://wa.me/${OWNER_WHATSAPP}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", padding: "16px 36px", borderRadius: 100, fontSize: 16, fontWeight: 600, color: "var(--espresso)", background: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", display: "inline-flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 20 }}>💬</span>WhatsApp Us</a>
                <a href="tel:+919999999999" style={{ textDecoration: "none", padding: "16px 36px", borderRadius: 100, fontSize: 16, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", display: "inline-flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>📞</span>Call Now</a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function Contact() {
  const [formState, setFormState] = useState({ name: "", phone: "", message: "" });
  return (
    <section id="contact" style={{ padding: "100px 0 80px", background: "linear-gradient(180deg, var(--cream) 0%, rgba(245,230,200,0.4) 100%)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--caramel)", marginBottom: 12 }}>Get in Touch</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "var(--espresso)" }}>Let's <span style={{ fontStyle: "italic", color: "var(--caramel)" }}>Connect</span></h2>
          </div>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="contact-grid">
          <AnimatedSection animation="slideInLeft" delay={0.1}>
            <div style={{ padding: 40, borderRadius: "var(--radius-lg)", background: "var(--bg-card)", boxShadow: "var(--shadow-md)", border: "1px solid rgba(200,149,108,0.08)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, color: "var(--espresso)", marginBottom: 28 }}>Send us a Message</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[{ key: "name", label: "Your Name", placeholder: "e.g. Rahul Sharma", type: "text" }, { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" }].map((field) => (
                  <div key={field.key}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} value={formState[field.key]} onChange={(e) => setFormState({ ...formState, [field.key]: e.target.value })} style={{ width: "100%", padding: "14px 20px", borderRadius: "var(--radius-sm)", border: "1.5px solid rgba(200,149,108,0.2)", background: "var(--cream)", fontSize: 15, color: "var(--text-primary)", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Message</label>
                  <textarea placeholder="Tell us about your order..." rows={4} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} style={{ width: "100%", padding: "14px 20px", borderRadius: "var(--radius-sm)", border: "1.5px solid rgba(200,149,108,0.2)", background: "var(--cream)", fontSize: 15, color: "var(--text-primary)", outline: "none", resize: "vertical", fontFamily: "'DM Sans', sans-serif" }} />
                </div>
                <button style={{ padding: "16px 36px", borderRadius: 100, border: "none", fontSize: 16, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, var(--caramel), var(--chocolate))", boxShadow: "0 6px 25px rgba(200,149,108,0.3)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Send Message →</button>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="slideInRight" delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { icon: "📍", title: "Visit Our Bakery", lines: ["Sincere Bakery", "Shop No. 12, Main Market Road", "Your City — 110001"] },
                { icon: "🕐", title: "Opening Hours", lines: ["Mon–Sat: 7AM – 9PM", "Sunday: 8AM – 8PM"] },
                { icon: "📞", title: "Call / WhatsApp", lines: ["+91 99999 99999"] },
                { icon: "📧", title: "Email", lines: ["orders@sincerebakery.in"] },
              ].map((info, i) => (
                <div key={i} style={{ padding: 28, borderRadius: "var(--radius)", background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid rgba(200,149,108,0.08)", display: "flex", gap: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, rgba(245,230,200,0.6), rgba(232,180,162,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{info.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "var(--espresso)", marginBottom: 6 }}>{info.title}</div>
                    {info.lines.map((line, j) => (<div key={j} style={{ fontSize: 14, color: "var(--text-light)", lineHeight: 1.6 }}>{line}</div>))}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "60px 0 32px", background: "var(--espresso)", color: "rgba(255,255,255,0.7)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--caramel), var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>S</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>Sincere</div>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--caramel)" }}>Bakery</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>Baking happiness since 2009.</p>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Quick Links</div>
            {["Home", "Menu", "About", "Reviews", "Contact"].map((link) => (<a key={link} href={`#${link.toLowerCase()}`} style={{ display: "block", textDecoration: "none", color: "rgba(255,255,255,0.6)", fontSize: 14, padding: "6px 0" }}>{link}</a>))}
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Follow Us</div>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ label: "IG", color: "#E1306C" }, { label: "FB", color: "#1877F2" }, { label: "YT", color: "#FF0000" }].map((s, i) => (
                <div key={i} style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", cursor: "pointer", transition: "all 0.3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>{s.label}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13 }}>
          <div>© 2024 Sincere Bakery. All rights reserved.</div>
          <div style={{ color: "rgba(255,255,255,0.4)" }}>Crafted with ❤️ and flour</div>
        </div>
      </div>
    </footer>
  );
}

function CartSidebar({ cart, isOpen, onClose, onAdd, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (!isOpen) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1001, animation: "fadeIn 0.3s ease" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 90vw)", background: "var(--cream)", zIndex: 1002, boxShadow: "-10px 0 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", animation: "slideInRight 0.3s ease" }}>
        <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(200,149,108,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "var(--espresso)" }}>Your Cart</h3>
            <p style={{ fontSize: 13, color: "var(--text-light)", marginTop: 4 }}>{cart.reduce((s, i) => s + i.qty, 0)} items</p>
          </div>
          <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "var(--bg-card)", color: "var(--espresso)", fontSize: 20, cursor: "pointer", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--text-secondary)", marginBottom: 8 }}>Your cart is empty</p>
              <p style={{ fontSize: 14, color: "var(--text-light)" }}>Add delicious items from our menu!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cart.map((item) => (
                <div key={item.id} style={{ padding: 20, borderRadius: "var(--radius)", background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid rgba(200,149,108,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "var(--espresso)", marginBottom: 4 }}>{item.emoji} {item.name}</div>
                    <div style={{ fontSize: 14, color: "var(--caramel)", fontWeight: 600 }}>₹{item.price} × {item.qty} = ₹{item.price * item.qty}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => onRemove(item.id)} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(200,149,108,0.3)", background: "var(--cream)", color: "var(--chocolate)", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onAdd(item)} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "linear-gradient(135deg, var(--caramel), var(--chocolate))", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "24px 28px", borderTop: "1px solid rgba(200,149,108,0.15)", background: "var(--bg-card)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span><span>₹{total}</span>
            </div>
            {total >= 500 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}><span style={{ color: "var(--sage)", fontWeight: 600 }}>🚚 Free Delivery</span><span style={{ color: "var(--sage)", fontWeight: 600 }}>₹0</span></div>}
            {total < 500 && <div style={{ fontSize: 12, color: "var(--text-light)", marginBottom: 8, textAlign: "center" }}>₹{500 - total} aur add karo for free delivery!</div>}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(200,149,108,0.1)", marginBottom: 20 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--espresso)" }}>Total</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "var(--caramel)" }}>₹{total}</span>
            </div>
            <button onClick={onCheckout} style={{ width: "100%", padding: 16, borderRadius: 100, border: "none", fontSize: 16, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, var(--caramel), var(--chocolate))", boxShadow: "0 6px 25px rgba(200,149,108,0.35)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>Proceed to Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}

function CheckoutPage({ cart, onBack, onOrderPlaced }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", landmark: "", pincode: "", payment: "cod", upiId: "" });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = total >= 500 ? 0 : 40;
  const grandTotal = total + deliveryFee;

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) err.phone = "Valid phone required";
    if (!form.address.trim()) err.address = "Address required";
    if (!form.pincode.trim() || form.pincode.length < 5) err.pincode = "Valid pincode required";
    if (form.payment === "upi" && !form.upiId.trim()) err.upiId = "UPI ID required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const placeOrder = () => {
    if (!validate()) return;
    setPlacing(true);
    const orderItems = cart.map((item) => `• ${item.name} × ${item.qty} = ₹${item.price * item.qty}`).join("\n");
    const orderTime = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const orderId = "SB" + Date.now().toString().slice(-6);
    const message = `🧁 *NEW ORDER — SINCERE BAKERY*\n\n📋 *Order ID:* ${orderId}\n🕐 *Time:* ${orderTime}\n\n*━━━ Items ━━━*\n${orderItems}\n\n*━━━ Bill ━━━*\nSubtotal: ₹${total}\nDelivery: ${deliveryFee === 0 ? "FREE 🎉" : `₹${deliveryFee}`}\n*TOTAL: ₹${grandTotal}*\n\n*━━━ Customer ━━━*\n👤 *Name:* ${form.name}\n📞 *Phone:* ${form.phone}\n\n*━━━ Delivery Address ━━━*\n📍 ${form.address}\n${form.landmark ? `🏠 Landmark: ${form.landmark}` : ""}\n📮 Pincode: ${form.pincode}\n\n*━━━ Payment ━━━*\n💳 ${form.payment === "cod" ? "Cash on Delivery" : `UPI (${form.upiId})`}`;
    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
    setTimeout(() => { window.open(whatsappUrl, "_blank"); setPlacing(false); onOrderPlaced(orderId); }, 1500);
  };

  const inputStyle = (field) => ({ width: "100%", padding: "14px 20px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${errors[field] ? "#e74c3c" : "rgba(200,149,108,0.2)"}`, background: "var(--cream)", fontSize: 15, color: "var(--text-primary)", outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.3s" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--caramel)", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 32, fontFamily: "'DM Sans', sans-serif" }}>← Back to Menu</button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "var(--espresso)", marginBottom: 8 }}>Checkout</h2>
        <p style={{ fontSize: 14, color: "var(--text-light)", marginBottom: 40 }}>Fill in your details to place the order</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40 }} className="checkout-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Customer Details */}
            <div style={{ padding: 32, borderRadius: "var(--radius-lg)", background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid rgba(200,149,108,0.08)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "var(--espresso)", marginBottom: 24 }}>👤 Customer Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Full Name *</label>
                  <input type="text" placeholder="e.g. Rahul Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle("name")} />
                  {errors.name && <span style={{ fontSize: 12, color: "#e74c3c", marginTop: 4, display: "block" }}>{errors.name}</span>}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Phone Number *</label>
                  <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle("phone")} />
                  {errors.phone && <span style={{ fontSize: 12, color: "#e74c3c", marginTop: 4, display: "block" }}>{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ padding: 32, borderRadius: "var(--radius-lg)", background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid rgba(200,149,108,0.08)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "var(--espresso)", marginBottom: 24 }}>📍 Delivery Address</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Full Address *</label>
                  <textarea placeholder="House/Flat no., Street, Area, City..." rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ ...inputStyle("address"), resize: "vertical" }} />
                  {errors.address && <span style={{ fontSize: 12, color: "#e74c3c", marginTop: 4, display: "block" }}>{errors.address}</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Landmark</label>
                    <input type="text" placeholder="Near..." value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} style={inputStyle("landmark")} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Pincode *</label>
                    <input type="text" placeholder="110001" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} style={inputStyle("pincode")} />
                    {errors.pincode && <span style={{ fontSize: 12, color: "#e74c3c", marginTop: 4, display: "block" }}>{errors.pincode}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ padding: 32, borderRadius: "var(--radius-lg)", background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid rgba(200,149,108,0.08)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "var(--espresso)", marginBottom: 24 }}>💳 Payment Method</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { value: "cod", icon: "💵", title: "Cash on Delivery", desc: "Pay when your order arrives" },
                  { value: "upi", icon: "📱", title: "UPI Payment", desc: "GPay, PhonePe, Paytm, etc." },
                ].map((opt) => (
                  <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderRadius: "var(--radius)", border: `2px solid ${form.payment === opt.value ? "var(--caramel)" : "rgba(200,149,108,0.15)"}`, background: form.payment === opt.value ? "rgba(200,149,108,0.06)" : "transparent", cursor: "pointer", transition: "all 0.3s" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${form.payment === opt.value ? "var(--caramel)" : "rgba(200,149,108,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {form.payment === opt.value && <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--caramel)" }} />}
                    </div>
                    <input type="radio" name="payment" value={opt.value} checked={form.payment === opt.value} onChange={(e) => setForm({ ...form, payment: e.target.value })} style={{ display: "none" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: "var(--espresso)" }}>{opt.icon} {opt.title}</div>
                      <div style={{ fontSize: 13, color: "var(--text-light)" }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
                {form.payment === "upi" && (
                  <div style={{ marginTop: 8, paddingLeft: 38 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Your UPI ID *</label>
                    <input type="text" placeholder="yourname@paytm" value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} style={inputStyle("upiId")} />
                    {errors.upiId && <span style={{ fontSize: 12, color: "#e74c3c", marginTop: 4, display: "block" }}>{errors.upiId}</span>}
                    <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 8 }}>Payment link will be shared on WhatsApp after confirmation</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{ position: "sticky", top: 100, padding: 32, borderRadius: "var(--radius-lg)", background: "var(--bg-card)", boxShadow: "var(--shadow-md)", border: "1px solid rgba(200,149,108,0.08)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "var(--espresso)", marginBottom: 24 }}>Order Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "var(--text-secondary)" }}>{item.emoji} {item.name} × {item.qty}</span>
                    <span style={{ fontWeight: 600, color: "var(--espresso)" }}>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(200,149,108,0.1)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span style={{ color: "var(--text-light)" }}>Subtotal</span><span>₹{total}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span style={{ color: "var(--text-light)" }}>Delivery</span><span style={{ color: deliveryFee === 0 ? "var(--sage)" : "inherit", fontWeight: deliveryFee === 0 ? 600 : 400 }}>{deliveryFee === 0 ? "FREE 🎉" : `₹${deliveryFee}`}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(200,149,108,0.1)", marginTop: 8 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--espresso)" }}>Total</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "var(--caramel)" }}>₹{grandTotal}</span>
                </div>
              </div>
              <button onClick={placeOrder} disabled={placing} style={{ width: "100%", padding: 16, borderRadius: 100, border: "none", fontSize: 16, fontWeight: 600, color: "#fff", background: placing ? "var(--text-light)" : "linear-gradient(135deg, var(--caramel), var(--chocolate))", boxShadow: placing ? "none" : "0 6px 25px rgba(200,149,108,0.35)", cursor: placing ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {placing ? "⏳ Placing Order..." : "Place Order via WhatsApp 💬"}
              </button>
              <p style={{ fontSize: 11, color: "var(--text-light)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>Order details will be sent via WhatsApp. You'll receive confirmation shortly!</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .checkout-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function OrderSuccess({ orderId, onHome }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ textAlign: "center", maxWidth: 500, animation: "fadeInUp 0.6s ease" }}>
        <div style={{ fontSize: 80, marginBottom: 24, animation: "checkmark 0.6s ease 0.3s both" }}>✅</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "var(--espresso)", marginBottom: 12 }}>Order Placed!</h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.6 }}>Your order <strong style={{ color: "var(--caramel)" }}>#{orderId}</strong> has been sent to Sincere Bakery via WhatsApp.</p>
        <p style={{ fontSize: 15, color: "var(--text-light)", marginBottom: 40, lineHeight: 1.6 }}>We'll confirm your order and delivery time shortly. Thank you! 🧁</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onHome} style={{ padding: "16px 36px", borderRadius: 100, border: "none", fontSize: 16, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, var(--caramel), var(--chocolate))", boxShadow: "0 6px 25px rgba(200,149,108,0.35)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back to Home</button>
          <a href={`https://wa.me/${OWNER_WHATSAPP}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", padding: "16px 36px", borderRadius: 100, fontSize: 16, fontWeight: 600, color: "var(--chocolate)", background: "var(--bg-card)", border: "1.5px solid rgba(200,149,108,0.3)", display: "inline-flex", alignItems: "center", gap: 8 }}>💬 Chat with Us</a>
        </div>
      </div>
    </div>
  );
}

function FloatingCartButton({ cart, onClick }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  if (count === 0) return null;
  return (
    <button onClick={onClick} style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", padding: "14px 32px", borderRadius: 100, border: "none", background: "linear-gradient(135deg, var(--caramel), var(--chocolate))", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 30px rgba(200,149,108,0.4)", zIndex: 998, display: "flex", alignItems: "center", gap: 12, animation: "slideUp 0.4s ease, cartBounce 2s ease infinite 1s", fontFamily: "'DM Sans', sans-serif" }}>
      <span style={{ fontSize: 20 }}>🛒</span><span>{count} items</span>
      <span style={{ width: 1, height: 20, background: "rgba(255,255,255,0.3)" }} />
      <span style={{ fontWeight: 700 }}>₹{total}</span>
    </button>
  );
}

export default function SincereBakery() {
  const [activeSection, setActiveSection] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState("home");
  const [successOrderId, setSuccessOrderId] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (page !== "home") return;
    const sections = ["home", "menu", "about", "reviews", "contact"];
    const handler = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) { const rect = el.getBoundingClientRect(); if (rect.top <= 200 && rect.bottom > 200) { setActiveSection(id); break; } }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [page]);

  const addToCart = (item, catIdx) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1, emoji: catIdx !== undefined ? BAKERY_ITEMS[catIdx].emoji : (item.emoji || "🧁") }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const goToCheckout = () => { setCartOpen(false); setPage("checkout"); window.scrollTo(0, 0); };
  const handleOrderPlaced = (orderId) => { setSuccessOrderId(orderId); setCart([]); setPage("success"); window.scrollTo(0, 0); };
  const goHome = () => { setPage("home"); window.scrollTo(0, 0); };

  if (page === "checkout") {
    return (
      <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
        <div className="grain-overlay" />
        <Navbar activeSection="" cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
        <CheckoutPage cart={cart} onBack={goHome} onOrderPlaced={handleOrderPlaced} />
        <CartSidebar cart={cart} isOpen={cartOpen} onClose={() => setCartOpen(false)} onAdd={(item) => addToCart(item)} onRemove={removeFromCart} onCheckout={goToCheckout} />
      </div>
    );
  }

  if (page === "success") {
    return (
      <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
        <div className="grain-overlay" />
        <OrderSuccess orderId={successOrderId} onHome={goHome} />
      </div>
    );
  }

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <div className="grain-overlay" />
      <Navbar activeSection={activeSection} cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <Hero />
      <FeaturesStrip />
      <Menu cart={cart} onAddToCart={addToCart} onRemoveFromCart={removeFromCart} />
      <About />
      <Testimonials />
      <CTABanner />
      <Contact />
      <Footer />
      <FloatingCartButton cart={cart} onClick={() => setCartOpen(true)} />
      <CartSidebar cart={cart} isOpen={cartOpen} onClose={() => setCartOpen(false)} onAdd={(item) => addToCart(item)} onRemove={removeFromCart} onCheckout={goToCheckout} />
    </div>
  );
}
