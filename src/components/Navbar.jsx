import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/submit", label: "Submit need" },
  { to: "/register", label: "Register volunteer" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: 54,
      background: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <Link to="/dashboard" style={{ textDecoration: "none" }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
          Volunteer<span style={{ color: "#16A34A" }}>Connect</span>
        </span>
      </Link>

      <div style={{ display: "flex", gap: 4 }}>
        {links.map(link => {
          const active = pathname === link.to;
          return (
            <Link key={link.to} to={link.to} style={{
              fontSize: 13, fontWeight: active ? 600 : 400,
              color: active ? "#16A34A" : "#6b7280",
              textDecoration: "none",
              padding: "6px 14px", borderRadius: 8,
              background: active ? "#F0FDF4" : "transparent",
            }}>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}