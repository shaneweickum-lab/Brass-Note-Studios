const stats = [
  { value: "30", label: "Years of Musicianship" },
  { value: "30+", label: "Songs Produced" },
  { value: "100%", label: "View-Through Rate" },
  { value: "15K", label: "YouTube Views — First Drop" },
];

export default function StatsStrip() {
  return (
    <div className="bg-surface-elevated border-y border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gold/10">
          {stats.map(({ value, label }) => (
            <div key={label} className="px-6 py-5 text-center">
              <p className="font-display text-2xl md:text-3xl text-gold">{value}</p>
              <p className="font-body text-xs text-text-muted mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
