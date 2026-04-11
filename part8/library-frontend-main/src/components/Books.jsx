import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState, useEffect } from "react";

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState("all genres");
  const { loading, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: genreFilter === "all genres" ? null : genreFilter }
  })
  const handleGenreChange = (genre) => {
    setGenreFilter(genre)
    // FORCE a refetch of this specific filtered query
    refetch({ genre: genre === "all genres" ? null : genre })
  }
  const all = useQuery(ALL_BOOKS);
  if (!props.show) {
    return null;
  }


  if (loading || all.loading) {
    return <div>loading...</div>;
  }

  const filtered = data.allBooks;

  const allBooks = all.data.allBooks;
  const allGenres = [];
  // books.data.allBooks.forEach(b => b.genres.forEach(g => allGenres.includes(g) && allGenres.push(g) ))
  allBooks.forEach((b) =>
    b.genres.forEach((g) => !allGenres.includes(g) && allGenres.push(g)),
  );

  // const booksToShow = genreFilter === 'all genres' ? books : books.filter(b => b.genres.includes(genreFilter))

  return (
    <div>
      <h2>books</h2>
      {genreFilter !== "all genres" && (
        <p>
          in genre <strong>{genreFilter}</strong>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filtered.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {allGenres.map((g) => (
        <button key={g} onClick={() => handleGenreChange(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setGenreFilter("all genres")}>all genres</button>
    </div>
  );
};

export default Books;
