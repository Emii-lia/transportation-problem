import classNames from "classnames";
import useCellInput from "@/components/CellInput/useCellInput";
import "./CellInput.scss"
import { CellColor } from "@/types/data";

type Props = {
  value: number
  onChange?: (value: number) => void
  disabled?: boolean
  className?: string
  id?: string
  withBorder?: boolean
  color?: CellColor
}
const CellInput = ({
  onChange,
  disabled = false,
  value,
  id,
  withBorder,
  className,
  color = "none"
}: Props) => {
  const {
    isEditing,
    toggleEdit,
    handleEnter,
    handleBlur,
    handleChange
  } = useCellInput({
    disabled,
    onChange
  })
  return (
    <div
      className={classNames(
        "CellInput",
        className,
        color,
        {withBorder, disabled},
      )}
      id={id}
    >
      {isEditing?
        <input
          className="value-input"
          value={value}
          onInput={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleEnter}
          disabled={disabled}
        />:
        <div
          className="display-cell"
          onClick={toggleEdit}
        >
          {value < 0 ? 'e' :((value === 0 && withBorder) ? "-" : value)}
        </div>
      }
    </div>
  )
}
export default CellInput;