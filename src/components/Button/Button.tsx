import styles from './Button.module.css'

interface ButtonProps {
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ 
  disabled = false, 
  children,
  type = 'button',
  ...props 
}) => {
  return (
    <button 
      type={type}
      disabled={disabled}
      {...props}
      className={styles.button}
    >
      {children}
    </button>
  );
};