import './ToogleButton.scss';
import useToogleButton from './useToogleButton';
import { useId } from 'react';
import classNames from "classnames";

type Props = {
  onClick: () => void;
  isActive: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

const ToogleButton = ({
  onClick, 
  isActive,
  size = "md",
  disabled
 }: Props) => {
  const { toogle } = useToogleButton({ onClick, disabled });
  const uniqueId = useId();

  return (
    <div className={classNames("ToogleButton", size)} onClick={toogle}>
      <label htmlFor={`checkbox-${uniqueId}`}>
        <input
          type="checkbox"
          id={`checkbox-${uniqueId}`}
          checked={isActive}
          disabled={disabled}
          onChange={(event) => event.stopPropagation()}
          className="toogleButton-checkbox peer"
        />
        <span
          className="toogleButton-slider"
          onClick={toogle}
        ></span>
      </label>
    </div>
  );
};

export default ToogleButton;
