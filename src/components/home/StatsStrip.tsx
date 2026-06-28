const stats = [
  { value: "30+", label: "Years as Musicians & Songwriters" },
  { value: "100+", label: "Songs Produced" },
  { value: "10", label: "Years Sound Production & Engineering" },
  { value: "AI", label: "Architectural Designer & Engineer", span: true },
];

export default function StatsStrip() {
  return (
    <div className="bg-surface-elevated border-y border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label, span }, i) => (
            <div
              key={label}
              className={`px-4 sm:px-6 py-5 text-center border-gold/10 ${
                span ? "col-span-2 lg:col-span-1" : ""
              } ${
                i < 2 ? "border-b lg:border-b-0" : ""
              } ${
                i % 2 === 1 && !span ? "border-l lg:border-l-0" : ""
              } ${
                i > 0 ? "lg:border-l" : ""
              }`}
            >
              <p className="font-display text-2xl md:text-3xl text-gold">{value}</p>
              <p className="font-body text-xs text-text-muted mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
