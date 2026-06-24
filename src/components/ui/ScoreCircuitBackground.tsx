export default function ScoreCircuitBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* ── L4: Glow Pools ─────────────────────────────────── */}
      {/* Hero — warm brass spotlight */}
      <div
        className="absolute"
        style={{
          top: "-30vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "140vw",
          height: "100vh",
          background:
            "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(212,168,67,0.06) 0%, transparent 70%)",
        }}
      />
      {/* Method / mid-page — electric teal signal */}
      <div
        className="absolute"
        style={{
          top: "45%",
          right: "-15vw",
          width: "75vw",
          height: "75vw",
          background:
            "radial-gradient(ellipse at center, rgba(13,148,136,0.05) 0%, transparent 65%)",
        }}
      />

      {/* ── L5: Saxophone Silhouette — desktop only ─────────── */}
      <svg
        viewBox="0 0 200 580"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute hidden md:block"
        style={{
          top: "8%",
          right: "6%",
          height: "72vh",
          width: "auto",
          opacity: 0.04,
          fill: "#D4A843",
        }}
      >
        {/* Body — J-shaped silhouette */}
        <path d="M 148 10 C 143 10 130 17 120 34 C 110 51 103 72 99 98 L 83 382 C 80 422 69 458 46 480 C 29 497 8 500 4 489 C 0 478 15 468 35 473 C 55 478 69 463 75 442 C 81 420 83 395 81 382 L 97 98 C 101 72 110 51 122 34 C 134 17 146 10 150 10 Z" />
        {/* Bell */}
        <ellipse cx="23" cy="485" rx="23" ry="10" />
        {/* Neck strap ring */}
        <rect x="120" y="100" width="20" height="6" rx="3" />
        {/* Mouthpiece */}
        <rect x="146" y="0" width="14" height="26" rx="4" transform="rotate(6 153 13)" />
        {/* Key pads */}
        <circle cx="84" cy="165" r="7" />
        <circle cx="83" cy="205" r="7" />
        <circle cx="83" cy="250" r="9" />
        <circle cx="83" cy="298" r="9" />
        <circle cx="82" cy="342" r="7" />
      </svg>

      {/* ── L1: Staff Lines — fade out toward right ─────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg," +
            "transparent 0px,transparent 18px," +
            "rgba(250,243,224,0.03) 18px,rgba(250,243,224,0.03) 19px," +
            "transparent 19px,transparent 23px," +
            "rgba(250,243,224,0.03) 23px,rgba(250,243,224,0.03) 24px," +
            "transparent 24px,transparent 28px," +
            "rgba(250,243,224,0.03) 28px,rgba(250,243,224,0.03) 29px," +
            "transparent 29px,transparent 33px," +
            "rgba(250,243,224,0.03) 33px,rgba(250,243,224,0.03) 34px," +
            "transparent 34px,transparent 38px," +
            "rgba(250,243,224,0.03) 38px,rgba(250,243,224,0.03) 39px," +
            "transparent 39px,transparent 75px)",
          maskImage:
            "linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 30%, transparent 60%)",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 30%, transparent 60%)",
        }}
      />

      {/* ── L2: Circuit Traces — fade in from right ─────────── */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{
          opacity: 0.055,
          maskImage:
            "linear-gradient(to right, transparent 38%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.7) 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 38%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.7) 100%)",
        }}
      >
        <g stroke="#0D9488" strokeWidth="1.5" fill="none">
          {/* Trace 1 — upper */}
          <path d="M 600 85 L 790 85 L 790 160 L 1030 160 L 1030 220 L 1270 220" />
          <circle cx="790" cy="85"  r="3.5" fill="#0D9488" />
          <circle cx="1030" cy="160" r="3.5" fill="#0D9488" />
          <rect x="1266" y="216" width="8" height="8" rx="1" fill="#0D9488" />

          {/* Trace 2 — upper-mid */}
          <path d="M 670 305 L 870 305 L 870 375 L 1150 375" />
          <circle cx="870" cy="305" r="3.5" fill="#0D9488" />
          <rect x="1146" y="371" width="8" height="8" rx="1" fill="#0D9488" />

          {/* Trace 3 — mid */}
          <path d="M 585 468 L 750 468 L 750 542 L 990 542 L 990 608 L 1330 608" />
          <circle cx="750" cy="468" r="3.5" fill="#0D9488" />
          <circle cx="990" cy="542" r="3.5" fill="#0D9488" />
          <rect x="1326" y="604" width="8" height="8" rx="1" fill="#0D9488" />

          {/* Trace 4 — lower-mid */}
          <path d="M 630 675 L 830 675 L 830 742 L 1090 742" />
          <circle cx="830" cy="675" r="3.5" fill="#0D9488" />
          <rect x="1086" y="738" width="8" height="8" rx="1" fill="#0D9488" />

          {/* Trace 5 — lower */}
          <path d="M 555 828 L 710 828 L 710 878 L 960 878" />
          <circle cx="710" cy="828" r="3.5" fill="#0D9488" />
          <rect x="956" y="874" width="8" height="8" rx="1" fill="#0D9488" />
        </g>
      </svg>
    </div>
  );
}
