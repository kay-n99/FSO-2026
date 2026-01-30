const Persons = ({ searched, deleteP }) => {
  return (
    <>
      {searched.map((p) => (
        <div key={p.id}>
          <span>{p.name + " "}</span>
          <span>{p.number}</span>
          <button onClick={() => deleteP(p)}>delete</button>
          <br />
        </div>
      ))}
    </>
  );
};

export default Persons;
