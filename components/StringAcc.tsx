const strings = [
  { name: 'E', accuracy: 72 },
  { name: 'A', accuracy: 45 },
  { name: 'D', accuracy: 88 },
  { name: 'G', accuracy: 60 },
  { name: 'B', accuracy: 33 },
  { name: 'E', accuracy: 95 },
];

function getBarColor(pct: number): string {
  if (pct <= 50) return '#ef4444';
  if (pct <= 65) return '#f97316';
  if (pct <= 85) return '#eab308';
  return '#22c55e';               
}

const StringAcc = () => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
      <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-3 px-1">
        Accuracy By String
      </h2>
      <div className="flex flex-col gap-2">
        {strings.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="text-zinc-200 text-sm font-medium w-4 text-center shrink-0">
              {s.name}
            </span>
            <div className="flex-1 h-2.5 bg-zinc-600 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${s.accuracy}%`,
                  backgroundColor: getBarColor(s.accuracy),
                }}
              />
            </div>
            <span className="text-zinc-400 text-xs w-8 text-right shrink-0">
              {s.accuracy}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StringAcc