import React from "react";

const EntryForm = (props) => {
  return (
    <form onSubmit={props.savePerson}>
      <label>name</label>
      <input value={props.newName} onChange={props.handleNameChange} />
      <label>number</label>
      <input value={props.newNumber} onChange={props.handleNumberChange} />
      <button type="submit">add</button>
    </form>
  );
};

export default EntryForm;
