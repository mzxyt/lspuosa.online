import React, { useState } from "react";

export const ObjectiveTableInput = ({
  data,
  handleInputChange,
  inputData,
  entry,
}) => {
  const [type, setType] = useState({});

  const handleTypeChange = (k, value) => {
    setType((prevType) => ({
      ...prevType,
      [k]: value,
    }));
  };

  const handlePercentageChange = (e, k) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value === "") {
      handleInputChange(entry, k, ""); // Set empty string in state if input value is empty
    } else {
      value = Math.min(Math.max(parseInt(value), 1), 100); // Ensure value is between 1 and 100
      handleInputChange(entry, k, value); // Set value in state without appending "%" symbol
    }
  };

  return (
    <div className="rounded-lg overflow-auto border-[0.1rem] border-black">
      <table className="table-auto mt-2">
        <thead>
          <tr>
            {Object.values(data).map((v, i) => (
              <th key={i} className="px-4 py-2">
                {v}
              </th>
            ))}
            <th className="px-4 py-2">Documentation</th>
          </tr>
        </thead>
        <tbody className="">
          <tr className=" rounded-sm" key={entry}>
            {Object.keys(data).map((k, i) => {
              const currentType = type[k] || "quantity"; // Default type to quantity if not set
              return (
                <td key={i} className="px-4 py-2">
                  <div className="flex flex-col">
                    <select
                      value={currentType}
                      onChange={(e) => {
                        handleTypeChange(k, e.target.value);
                      }}
                    >
                      <option value="quantity">Quantity</option>
                      <option value="percentage">Percentage</option>
                    </select>
                    {currentType === "percentage" ? (
                      <input
                        type="text"
                        value={inputData[entry][k]}
                        onChange={(e) => handlePercentageChange(e, k)}
                        className="border-r-0 border-l-0 border-t-0 border-black"
                        required
                      />
                    ) : (
                      <input
                        type="number"
                        value={inputData[entry][k]}
                        onChange={(e) =>
                          handleInputChange(entry, k, e.target.value)
                        }
                        className="border-r-0 border-l-0 border-t-0 border-black"
                        required
                      />
                    )}
                  </div>
                </td>
              );
            })}

            <td className="px-4 flex py-2">
              <input
                type="file"
                className="border-none"
                onChange={(e) =>
                  handleInputChange(entry, "documentation", e.target.files)
                }
                required
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
