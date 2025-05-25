type Props = {
  onClick: () => void;
  disabled?: boolean;
}

const useToogleButton = ({onClick, disabled }: Props) => {
  const toogle = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).tagName === 'SPAN' || disabled ) return;
    onClick();
  };
 return { toogle };
}

export default useToogleButton;