import ToogleButton from "@/components/ToogleButton";
import "./ToggleInput.scss"
import React from "react";

type Props = {
  isActive: boolean
  onChange: () => void
  children: React.ReactNode
}
const ToggleInput = ({
  onChange,
  isActive,
  children
}: Props) => {
  return (
    <div className="ToggleInput">
      <ToogleButton
        onClick={onChange}
        isActive={isActive}
        size="sm"
      />
      <div className="toggle-label">
        {children}
      </div>
    </div>
  )
}

export default ToggleInput