import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};
export function Button({
  isOutlined = false,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      className={`btn ${isOutlined ? "btn-outlined" : ""}`}
      {...props}
    ></button>
  );
}
