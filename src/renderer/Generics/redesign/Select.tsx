export interface SelectProps {
  children: React.ReactNode;
}

export interface OptionProps {
  children: React.ReactNode;
}

export const Select = ({ children }: SelectProps) => {
  return <select>{children}</select>;
};

export const Option = ({ children }: OptionProps) => {
  return <option>{children}</option>;
};
