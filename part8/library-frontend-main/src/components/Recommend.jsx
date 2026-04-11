import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { ME } from "../queries";

const Books = (props) => {
  const result = useQuery(ALL_BOOKS);
  const me = useQuery(ME);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }
  if (me.loading) {
    return <div>loading me...</div>;
  }
  console.log(me);
  const favoriteGenre = me.data.me.favoriteGenre;
  const books = result.data.allBooks;

  //   const allGenres = [];
  //   // books.data.allBooks.forEach(b => b.genres.forEach(g => allGenres.includes(g) && allGenres.push(g) ))
  //   books.forEach(b => b.genres.forEach(g => !allGenres.includes(g) && allGenres.push(g)))

  //   const booksToShow = genreFilter === 'all genres' ? books : books.filter(b => b.genres.includes(genreFilter))
  const booksToShow =
    favoriteGenre != null
      ? books.filter((b) => b.genres.includes(favoriteGenre))
      : books;

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre {favoriteGenre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.length != 0 ? (
            booksToShow.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))
          ) : (
            <tr>
                <td></td>
              <td>nothing match user favorite genre</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
