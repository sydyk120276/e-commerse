import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'
import io from 'socket.io'
import axios from 'axios'

import config from './config'
import mongooseService from './services/mongoose'

import Html from '../client/html'

const { resolve } = require('path')

const { readFile, writeFile } = require('fs').promises

// const readFiled = () => {
//   return readFile(`${__dirname}/data/data.json`, 'utf8')
// }

const writeFiled = (rates) => {
  writeFile(`${__dirname}/data/rate.json`, JSON.stringify(rates), 'utf8')
}

const server = express()
const httpServer = http.createServer(server)

const PORT = config.port

const middleware = [
  cors(),
  cookieParser(),
  express.json({ limit: '50kb' }),
  express.static(resolve(__dirname, '../dist')),
  favicon(`${__dirname}/public/favicon.ico`)
]

middleware.forEach((it) => server.use(it))

server.get('/api/v1/products', async (req, res) => {
  const result = await readFile(`${__dirname}/data/data.json`, 'utf-8')
    .then((data) => JSON.parse(data))
    .catch(() => [])
  res.json(result.slice(0, 50))
})

server.get('/api/v1/rates', async (req, res) => {
  const result = await axios('https://api.exchangerate.host/latest?base=USD&symbols=USD,EUR,CAD')
    .then(({ data }) => {
      writeFiled(data.rates)
      return data.rates
    })
    .catch(async () => {
      try {
        const rate = await readFile(`${__dirname}/data/rate.json`, 'utf-8').then((text) => JSON.parse(text))
        return rate
      } catch (err) {
        console.log(err)
      }
      return { USD: 1 }
    })
  res.json(result)
})

function sortProductsList(arrayOfProducts, sortType, direction) {
  switch (sortType) {
    case 'name': {
      arrayOfProducts.sort((a, b) => {
        if (direction) {
          return a.title.localeCompare(b.title)
        }
        return b.title.localeCompare(a.title)
      })
      break
    }
    case 'price': {
      arrayOfProducts.sort((a, b) => {
        if (direction) {
          return a.price - b.price
        }
        return b.price - a.price
      })
      break
    }
    default:
      return arrayOfProducts
  }
  return arrayOfProducts
}

server.post('/api/v1/sort', async (req, res) => {
  const { sortType, direction } = req.body
  const arrayOfProducts = await readFile(`${__dirname}/data/data.json`, 'utf-8')
    .then((data) => JSON.parse(data))
    .catch(() => [])
  const sortArrayProducts = sortProductsList(arrayOfProducts, sortType, direction)
  res.json(sortArrayProducts.filter((_, index) => index < 50))
})

// let logs = []

server.post('/api/v1/logs', async (req, res) => {
  const logStr = req.body.text
  const log = await readFile(`${__dirname}/data/logs.json`, 'utf8')
    .then((arrOfLogs) => {
      const logs = JSON.parse(arrOfLogs)
      if (logs.length >= 100) {
        logs.shift()
      }
      writeFile(`${__dirname}/data/logs.json`, JSON.stringify([...logs, logStr]), 'utf8')
    })
    .catch(() => {
      writeFile(`${__dirname}/data/logs.json`, JSON.stringify([logStr]), 'utf8')
    })
  res.json(log)
})

server.get('/api/v1/logs', async (req, res) => {
  const logs = await readFile(`${__dirname}/data/logs.json`, { encoding: 'utf8' })
    .then((arrOfLogs) => {
      return JSON.parse(arrOfLogs)
    })
    .catch(() => [])
  res.json(logs)
})

server.get('/', (req, res) => {
  res.send('Express Server')
})

// MongoDB
if (config.mongoEnabled) {
  // eslint-disable-next-line
  console.log('MongoDB Enabled: ', config.mongoEnabled)
  mongooseService.connect()
}

// SocketsIO
if (config.socketsEnabled) {
  // eslint-disable-next-line
  console.log('Sockets Enabled: ', config.socketsEnabled)
  const socketIO = io(httpServer, {
    path: '/ws'
  })

  socketIO.on('connection', (socket) => {
    console.log(`${socket.id} login`)

    socket.on('disconnect', () => {
      console.log(`${socket.id} logout`)
    })
  })
}

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

httpServer.listen(PORT)
// eslint-disable-next-line
console.log(`Serving at http://localhost:${PORT}`)
