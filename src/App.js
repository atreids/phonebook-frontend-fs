import { useState, useEffect } from "react";
import PersonsList from "./components/PersonsList";
import EntryForm from "./components/EntryForm";
import Filter from "./components/Filter";
import personServices from "./services/persons";

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="error">{message}</div>;
};

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="success">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personsToShow, setPersonsToShow] = useState(persons);
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    personServices.getAll().then((initialPhonebook) => {
      setPersons(initialPhonebook);
      setPersonsToShow(initialPhonebook);
    });
  }, []);

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    updateList(newFilter);
  };

  const savePerson = (event) => {
    //preventing default page reload
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    //Checking if the person already exists within the phonebook
    for (const person of persons) {
      if (newPerson.name === person.name) {
        if (
          window.confirm(
            `${newPerson.name} already exists, replace the old number with a new number?`
          )
        ) {
          personServices
            .update(person.id, newPerson)
            .then((updatedPerson) => {
              //updates displayed list by replacing the exisitng list with a new one where
              //only the updated record is replaced.
              setPersonsToShow(
                personsToShow.map((person) =>
                  person.id === updatedPerson.id ? updatedPerson : person
                )
              );
              setPersons(
                persons.map((person) =>
                  person.id === updatedPerson.id ? updatedPerson : person
                )
              );
              setSuccessMessage(`Successfully updated ${updatedPerson.name}`);
              setTimeout(() => {
                setSuccessMessage(null);
              }, 5000);
            })
            .catch((error) => {
              setErrorMessage(
                `An error occured: ${person.name}'s information has already been removed from the server.`
              );
              personServices.getAll().then((serverPhonebook) => {
                setPersons(serverPhonebook);
                setPersonsToShow(serverPhonebook);
              });
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
            });
        }
        setNewName("");
        setNewNumber("");
        return;
      }
    }

    //if person doesn't exist, this creates a new person, updates json-db and local state
    personServices.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setPersonsToShow(persons.concat(returnedPerson));
      setFilter("");
      setNewName("");
      setNewNumber("");
      setSuccessMessage(`Successfully added ${returnedPerson.name}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    });
  };

  const updateList = (filter) => {
    if (filter === "") {
      setPersonsToShow(persons);
      return;
    }
    const initialValue = [];

    setPersonsToShow(
      persons.reduce((filteredPersons, currentPerson) => {
        if (currentPerson.name.includes(filter)) {
          filteredPersons.push(currentPerson);
          return filteredPersons;
        } else {
          return filteredPersons;
        }
      }, initialValue)
    );
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Do you really want to delete '${name}'?`)) {
      personServices
        .deletePerson(id)
        .then((response) => {
          setPersons(persons.filter((person) => person.id !== id));
          setPersonsToShow(personsToShow.filter((person) => person.id !== id));
          setSuccessMessage(`Deleted ${name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setErrorMessage("An error occured");
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successMessage} />
      <EntryForm
        savePerson={savePerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonsList personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
