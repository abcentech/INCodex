

type ButtonProps = {
  type: "button" | "submit";
  title: string | React.ReactNode;
  className?: string;
  disabled?: boolean;
  click?: boolean;
};

const Button = ({ type, title, className, disabled, click }: ButtonProps) => {
  return (
    <div>
      <button 
        type={type}
        className={`${className}`}
        disabled={disabled}
      >
        {title}
      </button>
    </div>
  );
};

export default Button;
