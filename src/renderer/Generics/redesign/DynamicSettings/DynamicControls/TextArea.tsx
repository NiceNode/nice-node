import { useEffect, useState } from 'react';

type Props = {
  isDisabled: boolean;
  value: string | undefined;
  onChange: (newValue: string) => void;
};
const TextArea = ({ isDisabled, value, onChange }: Props) => {
  const [sText, setText] = useState<string>();

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onChange(sText ?? '');
        }}
      >
        {/* <label>
          Essay: */}
        <textarea
          style={{
            minWidth: 400,
            minHeight: 30,
          }}
          value={sText}
          onChange={(e) => setText(e.target.value)}
          disabled={isDisabled}
        />
        {/* </label> */}
        <input type="submit" value="Submit" disabled={isDisabled} />
      </form>

      {/* <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option}
            </option>
          );
        })}
      </select> */}
    </>
  );
};
export default TextArea;
