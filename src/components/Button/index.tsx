import React from "react";
import classNames from "classnames";
import "./Button.scss"

type Props = {
  label: string,
  variant?: "primary" | "outlined"
} & React.ButtonHTMLAttributes<HTMLButtonElement>
const Button = ({
  label,
  className,
  variant = "primary",
  ...props
}: Props) => {
  return (
    <button
      className={classNames(
        "Button",
        className,
        variant
      )}
      {...props}
    >
      {label}
    </button>
  )
}

export default Button