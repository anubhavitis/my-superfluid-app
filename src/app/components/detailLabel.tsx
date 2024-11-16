import React from "react";

interface detailLabelProps {
  label: string;
  value: string;
}

function DetailLabel({ label, value }: detailLabelProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-sm text-gray-500">{label}</h2>
      <p
        className={`font-semibold ${
          value.startsWith("-") ? "text-red-600" : "text-green-600"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default DetailLabel;
