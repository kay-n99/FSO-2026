import { useQuery, useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR} from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
      refetchQueries: [{query: ALL_AUTHORS }],
    })
  
  const authors = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }
  if(authors.loading) {
    return <div>loading...</div>
  }

  const submit = async (event) => {
    event.preventDefault()
    const intBorn = Number(born)
    editAuthor({variables: {name, setBornTo:intBorn}})

    console.log('updating author..')

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
