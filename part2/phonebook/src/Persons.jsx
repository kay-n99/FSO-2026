const Persons = ({ searched }) => {
  return (
    <>
      {searched.map((p) => (
        <div key={p.id}>
          <span>{p.name + " "}</span>
          <span>{p.number}</span>
          <br />
        </div>
      ))}
    </>
  );
};

export default Persons;
