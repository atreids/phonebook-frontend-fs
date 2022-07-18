import React from "react";

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      <label>filter:</label>
      <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
