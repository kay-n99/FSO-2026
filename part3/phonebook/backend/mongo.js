const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@cluster0.yl1unwx.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
  Person.find().then(result => {
    result.forEach(p => {
      console.log(p)
    })
    mongoose.connection.close()
  })
}else if(process.argv.length === 5){
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log('phone saved!')
    mongoose.connection.close()
  })
}else{
  console.log('please provide correct arguments')
}
