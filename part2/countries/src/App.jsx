import { useState, useEffect } from "react";
import axios from "axios";
const App = () => {
  const [countries, setCountries] = useState(null);
  const [searchC, setSearchC] = useState("");

  useEffect(() => {
    console.log("fetching datas...");
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        console.log(response.data);
        setCountries(response.data);
      });
  }, []);

  const searched =
    searchC.length == 0 || countries == null ? (
      <></>
    ) : (
      countries.filter((c) =>
        c.name.common.toLowerCase().includes(searchC.toLowerCase()),
      )
    );

  const handleSearchChange = (event) => {
    setSearchC(event.target.value);
  };

  const CountryList = ({ country }) => {
    const [isClicked, setIsClicked] = useState(false);

    return (
      <>
        <span>{country.name.common}</span>
        <button onClick={() => setIsClicked(!isClicked)}>{isClicked ? "Hide" : "Show"}</button>
        {isClicked && (
          <div>
            <h2>{country.name.common}</h2>
            <span>Capital {country.capital}</span>
            <br />
            <span>Area {country.area}</span>
            <h2>Languages</h2>
            <ul>
              {Object.keys(country.languages).map((key, index) => (
                <li key={index}>{country.languages[key]}</li>
              ))}
            </ul>
            <img src={country.flags.png}></img>
          </div>
        ) }
        <br />
      </>
    );
  };

  return (
    <>
      find countries <input onChange={handleSearchChange} value={searchC} />
      <div>
        {searchC.length > 0 ? (
          countries ? (
            searched.length > 10 ? (
              <span>Too many matches, specify another filter</span>
            ) : searched.length == 1 ? (
              searched.map((c) => {
                return (
                  <div>
                    <h2>{c.name.common}</h2>
                    <span>Capital {c.capital}</span>
                    <br />
                    <span>Area {c.area}</span>
                    <h2>Languages</h2>
                    <ul>
                      {Object.keys(c.languages).map((key, index) => (
                        <li key={index}>{c.languages[key]}</li>
                      ))}
                    </ul>
                    <img src={c.flags.png}></img>
                  </div>
                );
              })
            ) : (
              searched.map((c) => <CountryList key={c.ccn3} country={c} />)
            )
          ) : (
            <span>fetching datas...</span>
          )
        ) : (
          <span>Search for a country</span>
        )}
      </div>
    </>
  );
};

export default App;
