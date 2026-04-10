import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState('all genres')
  const result = useQuery(ALL_BOOKS)
  if (!props.show) {
    return null
  }

  if(result.loading){
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  const allGenres = [];
  // books.data.allBooks.forEach(b => b.genres.forEach(g => allGenres.includes(g) && allGenres.push(g) ))
  books.forEach(b => b.genres.forEach(g => !allGenres.includes(g) && allGenres.push(g)))

  const booksToShow = genreFilter === 'all genres' ? books : books.filter(b => b.genres.includes(genreFilter))
  
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {allGenres.map((g) => (
        <button key={g} onClick={() => setGenreFilter(g)}>{g}</button>
      ))}
      <button onClick={() => setGenreFilter('all genres')}>all genres</button>
    </div>
  )
}

export default Books
