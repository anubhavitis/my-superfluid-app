interface StreamInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox = ({
  label,
  placeholder,
  value,
  onChange,
}: StreamInputProps) => {
  return (
    <div className="my-4 w-full">
      <label className="w-full block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-4 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                 transition-all duration-200"
      />
    </div>
  );
};

export default InputBox;
