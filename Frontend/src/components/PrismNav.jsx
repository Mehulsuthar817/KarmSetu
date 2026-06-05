import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, PlusSquare, User, Info, X } from "lucide-react";

// ── Prism colours cycling ──────────────────────────────────────────
const PRISM_COLORS = [
  "#00f5ff", "#a855f7", "#ec4899", "#3b82f6",
  "#22c55e", "#eab308", "#f97316", "#00f5ff",
];

function lerp(a, b, t) { return a + (b - a) * t; }

function usePrismColor(speed = 0.4) {
  const [color, setColor] = useState(PRISM_COLORS[0]);
  const tRef = useRef(0);
  useAnimationFrame((_, delta) => {
    tRef.current += (delta / 1000) * speed;
    const len   = PRISM_COLORS.length - 1;
    const index = tRef.current % len;
    const i     = Math.floor(index);
    const frac  = index - i;
    const from  = PRISM_COLORS[i % len];
    const to    = PRISM_COLORS[(i + 1) % len];
    // hex lerp
    const hex = (h) => parseInt(h.slice(1), 16);
    const r = (h) => (hex(h) >> 16) & 255;
    const g = (h) => (hex(h) >> 8)  & 255;
    const b = (h) =>  hex(h)        & 255;
    const nr = Math.round(lerp(r(from), r(to), frac));
    const ng = Math.round(lerp(g(from), g(to), frac));
    const nb = Math.round(lerp(b(from), b(to), frac));
    setColor(`rgb(${nr},${ng},${nb})`);
  });
  return color;
}

// ── Individual nav item ────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Home",       to: "/dashboard",   icon: Home,       beam: "#00f5ff" },
  { label: "Jobs",       to: "/jobs",        icon: Briefcase,  beam: "#a855f7" },
  { label: "Create Job", to: "/create-job", icon: PlusSquare, beam: "#ec4899" },
  { label: "MY Application", to: "/myapplication", icon: PlusSquare, beam: "#ec4899" },

  { label: "Profile",    to: "/profile",     icon: User,       beam: "#3b82f6" },
  { label: "About",      to: "/about",       icon: Info,       beam: "#22c55e" },
];

function NavItem({ item, onClose }) {
  const location  = useLocation();
  const isActive  = location.pathname === item.to;
  const Icon      = item.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()  => setHovered(false)}
      style={{ position: "relative" }}
    >
      {/* horizontal light beam */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="beam"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{   scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position:        "absolute",
              inset:           "0 -40px",
              background:      `linear-gradient(90deg, transparent, ${item.beam}33, ${item.beam}99, ${item.beam}33, transparent)`,
              borderRadius:    "12px",
              transformOrigin: "left center",
              pointerEvents:   "none",
              filter:          `blur(4px)`,
              zIndex:          0,
            }}
          />
          
        )}
      </AnimatePresence>
      <Link
        to={item.to}
        onClick={onClose}
        style={{ textDecoration: "none" }}
      >
        <motion.div
          animate={{
            scale:           hovered ? 1.04 : 1,
            backgroundColor: hovered
              ? `${item.beam}22`
              : isActive
              ? `${item.beam}18`
              : "rgba(255,255,255,0.04)",
          }}
          transition={{ duration: 0.2 }}
          style={{
            position:     "relative",
            zIndex:       1,
            display:      "flex",
            alignItems:   "center",
            gap:          "14px",
            padding:      "13px 18px",
            borderRadius: "14px",
            border:       isActive
              ? `1px solid ${item.beam}66`
              : "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(8px)",
            cursor:         "pointer",
            overflow:       "hidden",
          }}
        >
          {/* shimmer sweep on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key="shimmer"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                exit={{}}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  position:   "absolute",
                  top: 0, left: 0,
                  width:      "50%",
                  height:     "100%",
                  background: `linear-gradient(90deg, transparent, ${item.beam}44, transparent)`,
                  pointerEvents: "none",
                }}
              />
            )}
          </AnimatePresence>

          {/* icon */}
          <motion.div
            animate={{
              filter: hovered
                ? `drop-shadow(0 0 8px ${item.beam}) drop-shadow(0 0 16px ${item.beam}88)`
                : isActive
                ? `drop-shadow(0 0 6px ${item.beam})`
                : "none",
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              size={20}
              color={hovered || isActive ? item.beam : "rgba(255,255,255,0.7)"}
            />
          </motion.div>

          {/* label */}
          <motion.span
            animate={{
              color:      hovered || isActive ? "#ffffff" : "rgba(255,255,255,0.65)",
              textShadow: hovered ? `0 0 12px ${item.beam}` : "none",
            }}
            transition={{ duration: 0.2 }}
            style={{
              fontSize:      "15px",
              fontWeight:    isActive ? 700 : 500,
              letterSpacing: "0.03em",
              fontFamily:    "'Segoe UI', system-ui, sans-serif",
            }}
          >
            {item.label}
          </motion.span>

          {/* active indicator */}
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              style={{
                marginLeft: "auto",
                width:       "6px",
                height:      "6px",
                borderRadius:"50%",
                background:  item.beam,
                boxShadow:   `0 0 8px ${item.beam}, 0 0 16px ${item.beam}`,
              }}
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ── Floating prism trigger ─────────────────────────────────────────
function PrismTrigger({ onClick }) {
  const color = usePrismColor(0.5);

  return (
    <motion.div
      onClick={onClick}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.92 }}
      style={{
        position: "fixed",
        left:     "18px",
        top:      "50%",
        transform:"translateY(-50%)",
        zIndex:   1000,
        cursor:   "pointer",
      }}
    >
      {/* outer glow */}
      <motion.div
        animate={{ boxShadow: `0 0 24px 8px ${color}66, 0 0 48px 16px ${color}33` }}
        style={{
          width:        "48px",
          height:       "48px",
          borderRadius: "50%",
          display:      "flex",
          alignItems:   "center",
          justifyContent:"center",
        }}
      >
        {/* prism triangle SVG */}
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <defs>
            <linearGradient id="prismFace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={color}          stopOpacity="0.9" />
              <stop offset="40%"  stopColor="#ffffff"        stopOpacity="0.3" />
              <stop offset="100%" stopColor={color}          stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="prismEdge" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#ffffff"        stopOpacity="0.8" />
              <stop offset="100%" stopColor={color}          stopOpacity="0.4" />
            </linearGradient>
            <filter id="prismGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* main triangle */}
          <polygon
            points="22,4 42,38 2,38"
            fill="url(#prismFace)"
            stroke="url(#prismEdge)"
            strokeWidth="1.5"
            filter="url(#prismGlow)"
          />
          {/* inner highlight */}
          <polygon
            points="22,9 37,35 7,35"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.8"
          />
          {/* center shine */}
          <line x1="22" y1="8"  x2="22" y2="34" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <line x1="22" y1="20" x2="36" y2="36" stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
          <line x1="22" y1="20" x2="8"  y2="36" stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
        </svg>
        
      </motion.div>
      <p className=" relative left-0.5 font-bold text-white " >Menu</p>
    </motion.div>
  );
}

// ── Main Navbar ────────────────────────────────────────────────────
export default function PrismNavbar() {
  const [open, setOpen]     = useState(false);
  const prismColor          = usePrismColor(0.35);

  // close on outside click
  const sidebarRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      {/* Prism trigger — hidden when open */}
      <AnimatePresence>
        {!open && (
          <motion.div
            key="trigger"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0  }}
            exit={{    opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PrismTrigger onClick={() => setOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            style={{
              position:   "fixed",
              inset:      0,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(2px)",
              zIndex:     998,
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="sidebar"
            ref={sidebarRef}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0,       opacity: 1 }}
            exit={{    x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position:       "fixed",
              top:            "20%",
              left:           "20px",
              transform:      "translateY(-50%)",
              width:          "300px",
              zIndex:         999,
              borderRadius:   "24px",
              padding:        "24px 20px",
              background:     "rgba(10, 12, 20, 0.6)",
              backdropFilter: "blur(32px) saturate(180%)",
              border:         `1px solid ${prismColor}55`,
              boxShadow:      `0 0 40px ${prismColor}33, 0 0 80px ${prismColor}18, inset 0 1px 0 rgba(255,255,255,0.1)`,
            }}
          >
            {/* animated gradient border glow */}
            <motion.div
              animate={{
                boxShadow: `0 0 0 1.5px ${prismColor}88, 0 0 32px ${prismColor}44`,
              }}
              style={{
                position:     "absolute",
                inset:        0,
                borderRadius: "24px",
                pointerEvents:"none",
              }}
            />

            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"28px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <svg width="26" height="26" viewBox="0 0 44 44" fill="none">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor={prismColor} stopOpacity="0.9"/>
                      <stop offset="100%" stopColor="#ffffff"     stopOpacity="0.4"/>
                    </linearGradient>
                  </defs>
                  <polygon points="22,4 42,38 2,38" fill="url(#logoGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                </svg>
                <motion.span
                  animate={{ textShadow: `0 0 12px ${prismColor}` }}
                  style={{
                    color:         "#ffffff",
                    fontSize:      "16px",
                    fontWeight:    700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontFamily:    "'Segoe UI', system-ui, sans-serif",
                  }}
                >
                  KarmSetu
                </motion.span>
              </div>

              {/* Close button */}
              <motion.button
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{   scale: 0.9  }}
                style={{
                  background:     `${prismColor}22`,
                  border:         `1px solid ${prismColor}55`,
                  borderRadius:   "10px",
                  width:          "34px",
                  height:         "34px",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  cursor:         "pointer",
                  color:          prismColor,
                  boxShadow:      `0 0 10px ${prismColor}44`,
                }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Divider */}
            <motion.div
              animate={{ background: `linear-gradient(90deg, transparent, ${prismColor}88, transparent)` }}
              style={{ height:"1px", marginBottom:"20px", borderRadius:"1px" }}
            />

            {/* Nav items */}
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0,   opacity: 1 }}
                  transition={{ delay: i * 0.07, type:"spring", stiffness:280, damping:22 }}
                >
                  <NavItem item={item} onClose={() => setOpen(false)} />
                </motion.div>
              ))}
            </div>

            {/* Bottom glow */}
            <motion.div
              animate={{ background: `radial-gradient(ellipse at 50% 100%, ${prismColor}22, transparent 70%)` }}
              style={{
                position:      "absolute",
                bottom:        0, left: 0, right: 0,
                height:        "80px",
                borderRadius:  "0 0 24px 24px",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}