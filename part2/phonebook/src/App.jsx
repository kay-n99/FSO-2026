import { useState, useEffect } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((initial) => {
      setPersons(initial);
    });
  }, []);
  console.log("render", persons.length, "persons");

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
      id: (persons.length + 1).toString(),
    };
    const objectToFind = persons.find((p) => p.name === newName);
    if (objectToFind) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with new one?`,
        )
      ) {
        personService
          .update(objectToFind.id, { ...personObject, id: objectToFind.id })
          .then((updatedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== objectToFind.id ? p : updatedPerson,
              ),
            );
          });
      }
    } else {
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
      });
    }
    setNewName("");
    setNewNumber("");
  };

  const deletePerson = (p) => {
    if (window.confirm(`delete ${p.name} ?`)) {
      personService.del(p.id).then(() => {
      setPersons(persons.filter(person => person.id !== p.id));
    });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const searched =
    search.length == 0
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        );

  return (
    <div>
      <h2>phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons searched={searched} deleteP={deletePerson} />
    </div>
  );
};

export default App;
