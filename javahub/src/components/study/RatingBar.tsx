interface Props {
  onRate: (quality: 1 | 2 | 3 | 4 | 5) => void
}

const RATINGS: { q: 1 | 2 | 3 | 4 | 5; label: string; style: string }[] = [
  { q: 1, label: 'Blank',   style: 'bg-red-900 hover:bg-red-800 text-red-300' },
  { q: 2, label: 'Wrong',   style: 'bg-orange-900 hover:bg-orange-800 text-orange-300' },
  { q: 3, label: 'Hard',    style: 'bg-yellow-900 hover:bg-yellow-800 text-yellow-300' },
  { q: 4, label: 'Good',    style: 'bg-green-900 hover:bg-green-800 text-green-300' },
  { q: 5, label: 'Perfect', style: 'bg-emerald-900 hover:bg-emerald-800 text-emerald-300' },
]

export default function RatingBar({ onRate }: Props) {
  return (
    <div>
      <p className="text-xs text-center text-gray-500 mb-3">How well did you know it?</p>
      <div className="flex gap-2">
        {RATINGS.map(r => (
          <button
            key={r.q}
            onClick={() => onRate(r.q)}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${r.style}`}
          >
            <span className="block text-lg leading-none mb-0.5">{r.q}</span>
            <span className="text-xs opacity-75">{r.label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-center text-gray-600 mt-2">
        Keyboard: <kbd className="px-1 bg-gray-800 rounded">1</kbd>–<kbd className="px-1 bg-gray-800 rounded">5</kbd>
      </p>
    </div>
  )
}
