import React from "react";

const CustomYearInput = React.forwardRef(({ value, onClick }, ref) => {
  // Get the first year
  const firstYear = value ? new Date(value).getFullYear() : null;

  // Calculate the second year by adding 1 to the first year
  const secondYear = firstYear !== null ? firstYear + 1 : null;

  return (
    <input
      type="text"
      value={value ? `${firstYear}-${secondYear}` : ""}
      onClick={onClick}
      readOnly
      className="w-[100%] mb-2"
    />
  );
});

export default CustomYearInput;
