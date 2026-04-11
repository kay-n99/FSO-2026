import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";
import { useApolloClient, useQuery } from '@apollo/client/react'

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const client = useApolloClient()

  // if (!token) {
  //   return (
  //     <div>
  //       {" "}
  //       <LoginForm setToken={setToken} />{" "}
  //     </div>
  //   );
  // }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && <button onClick={() => setPage("recommend")}>recommend</button>}
        {token ? <button onClick={onLogout}>logout</button> : <button onClick={() => setPage("login")}>login</button>}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />
      <LoginForm show={page === "login"} setToken={setToken} setPage={setPage}/>
      <Recommend show={page === "recommend"} />

    </div>
  );
};

export default App;
