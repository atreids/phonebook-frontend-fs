import React from "react";

const PersonsList = ({ personsToShow, handleDelete }) => {
  return (
    <>
      <h2>Ledger:</h2>
      {personsToShow.map((personsToShow) => (
        <li key={personsToShow.id}>
          {personsToShow.name} {personsToShow.number}
          <button
            onClick={() => handleDelete(personsToShow.id, personsToShow.name)}
          >
            delete
          </button>
        </li>
      ))}
    </>
  );
};

export default PersonsList;
