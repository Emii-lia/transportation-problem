import "./Input.scss"
import classNames from "classnames";
import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement>{
  errorMessage?: string[]
}
const Input = ({
  errorMessage,
  className,
  ...props
}: Props) => {
  return (
    <div className="Input">
      <input
        {...props}
        className={classNames("input-field", className)}
      />
      {errorMessage && errorMessage.map((msg, index) => (
        <div
          className="error-message"
          key={index}
        >
          {msg}
        </div>
      ))}
    </div>
  )
}

export default Input;