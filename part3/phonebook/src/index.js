//  const http = require('http') 
const express = require('express')
const app = express()
 
//  const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json'})
//     response.end(JSON.stringify(persons))
// })
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const getInfo = (p) => {
  const total = p.reduce((acc, cur) => {
    return acc + 1;
  }, 0)
  return total;
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    
    const Time = new Date().toString()
    const pCount = persons.length;
    response.send(`Phonebook has info for ${pCount} people <br>${Time}`)
})

 const PORT = 3001
 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
 })