const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
app.use(express.static('dist'))
app.use(cors())

app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let phonebook = [
    { 
      "id": "1",
      "name": "Ali Ahmad", 
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


const randomId = () => {
const timestamp = Date.now(); 
  const randomPart = Math.floor(Math.random() * 100000); 
  return `${timestamp}${randomPart}`;

  
}


app.get('/', (request, response) => {
  response.send('<h1>Hello World! yes </h1>')
})


app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/info', (request, response) => {




  response.send('<p> Note book have the information of ' + phonebook.length + ' persons </p> <p>' + new Date() + '</p> ' )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const singleEntry = phonebook.find(person => person.id === id)
  if (singleEntry) {
    response.json(singleEntry)
  } else {
    response.status(404).send('Record not found')
  }
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const body = request.body


  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

   if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

   if (phonebook.some(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }



const person = {
    name: body.name ,
    number: body.number ,
    id: randomId() ,
  }

  console.log("The data " , person)

  phonebook = phonebook.concat(person)

  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})