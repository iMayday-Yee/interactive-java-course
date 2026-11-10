import type { CompareTable as CompareTableData } from '../../types/content'
import { RichText } from './RichText'

export function CompareTable({ table, caption }: { table: CompareTableData; caption?: string }) {
  return (
    <div className="table-wrap">
      <table className="compare-table">
        {caption ? <caption className="visually-hidden">{caption}</caption> : null}
        <thead>
          <tr>
            {table.headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  <RichText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
