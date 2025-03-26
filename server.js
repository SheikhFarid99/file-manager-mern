const express = require('express')
const app = express()
const dotEnv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

dotEnv.config()


app.use(cors({
  origin: "*"
}))



app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/file-manager', require('./routes/authRoute'))

const db_connect = async () => {
  try {
    await mongoose.connect(process.env.local_db_url)
    console.log('database connect...')
  } catch (error) {
    console.log('database connect failed ')
  }
}

db_connect()
const port = process.env.port
app.listen(port, () => console.log(`Server is running on port ${port}!`))