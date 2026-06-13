import type { CheatSheetTable as CheatSheetTableType } from '@/types/content'

interface Props {
  table: CheatSheetTableType
}

export function CheatSheetTable({ table }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-800 border-b border-gray-700">
            <th className="px-3 py-2 text-left text-gray-300 font-semibold whitespace-nowrap">
              {table.headers[0]}
            </th>
            {table.headers.slice(1).map((h, i) => (
              <th key={i} className="px-3 py-2 text-left text-gray-300 font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className={`border-b border-gray-800 ${ri % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/50'}`}>
              <td className="px-3 py-2 font-mono font-medium text-indigo-300 whitespace-nowrap">
                {row.label}
              </td>
              {row.columns.map((col, ci) => (
                <td key={ci} className="px-3 py-2 text-gray-300 leading-snug">
                  {col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
