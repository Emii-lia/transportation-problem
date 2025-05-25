import classNames from "classnames";
import useCellInput from "@/components/CellInput/useCellInput";
import "./CellInput.scss"

type Props = {
  value: number
  onChange?: (value: number) => void
  disabled?: boolean
  className?: string
  withBorder?: boolean
}
const CellInput = ({
  onChange,
  disabled = false,
  value,
  withBorder,
  className
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
        {withBorder}
      )}
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
          {value}
        </div>
      }
    </div>
  )
}
export default CellInput;