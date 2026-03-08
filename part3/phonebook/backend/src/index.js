//  const http = require('http') 
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const Person = require('../models/phone')

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(' :method :url :status :res[content-length] - :response-time ms :body'))


 
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

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => Number(n.id))) : 0
  return String(maxId + 1)
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    // response.json(persons)
    Person.find({}).then(result => {
        response.json(result);

       })
})

app.get('/info', (request, response) => {
    
    const Time = new Date().toString()
    const pCount = persons.length;
    response.send(`Phonebook has info for ${pCount} people <br>${Time}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p =>  p.id === id)
  
  if(person){
    response.json(person)
  }else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.number){
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const duplicateExist = persons.find((p) => p.name === body.name);

  if(duplicateExist){
    return response.status(409).json({
      error: 'name must be unique'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generateId(),
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

  // persons = persons.concat(person)
  // response.json(person)
})

 const PORT = process.env.PORT
 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
 })