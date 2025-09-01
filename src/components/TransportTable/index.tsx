"use client"
import CellInput from "@/components/CellInput";
import "./TransportTable.scss"

type Props = {
  demands: number[]
  supplies: number[]
  costs: number[][],
  id?: string
  onCellChange?: (rowIndex: number, colIndex: number, value: number) => void
  onSupplyChange?: (index: number, value: number) => void
  onDemandChange?: (index: number, value: number) => void
  disabled?: boolean
}
const TransportTable = ({
  costs,
  demands,
  disabled,
  supplies,
  id,
  onCellChange,
  onSupplyChange,
  onDemandChange
}: Props) => {
  return (
    <div
      className="TransportTable"
      id={id}
    >
      <div
        className="tr-row"
      >
        {costs.map((cRow, rowIndex) => (
          <div
            className="tr-col"
            key={rowIndex}
          >
            {cRow.map((c, colIndex) => (
              <CellInput
                value={c}
                key={colIndex}
                id={`cost-cell-${rowIndex}-${colIndex}`}
                onChange={
                  !!onCellChange? (value: number) =>
                    onCellChange(rowIndex, colIndex, value)
                    : undefined
                }
                disabled={disabled}
                withBorder
              />
            ))}
            <CellInput
              value={supplies[rowIndex]}
              onChange={
                !!onSupplyChange? (value: number) =>
                  onSupplyChange(rowIndex, value)
                  : undefined
              }
              disabled={disabled}
            />
          </div>
        ))}
        <div className="tr-col">
          {demands.map((d, colIndex) => (
            <CellInput
              value={d}
              key={colIndex}
              onChange={
                !!onDemandChange? (value: number) =>
                  onDemandChange(colIndex, value)
                  : undefined
              }
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TransportTable