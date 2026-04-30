"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ navText }: { navText: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme") as "dark" | "light" || "dark";
    setTheme(t);
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") as "dark" | "light" || "dark");
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Preklopi temo"
      title={theme === "dark" ? "Svetla tema" : "Temna tema"}
      style={{
        background: "none",
        border: `1px solid ${navText === "white" ? "rgba(255,255,255,0.25)" : "rgba(201,168,106,0.35)"}`,
        borderRadius: 999,
        width: 34,
        height: 34,
        cursor: "pointer",
        color: navText,
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
