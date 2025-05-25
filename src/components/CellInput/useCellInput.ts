import React, { useState } from "react";

type HookParams = {
  disabled?: boolean,
  onChange?: (value: number) => void
}
const useCellInput = ({
  disabled,
  onChange
}: HookParams) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => {
    if (disabled) return
    setIsEditing((prev) => !prev)
  }
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (onChange) {
      const parsedValue = parseInt(value)
      if (isNaN(parsedValue)) {
        onChange(0)
      } else {
        onChange(parsedValue)
      }
    }
  }

  const handleFocus = () => {
    if (disabled) return
    setIsEditing(true)
  }

  return {
    isEditing,
    toggleEdit,
    handleEnter,
    handleBlur,
    handleFocus,
    handleChange
  }
}

export default useCellInput