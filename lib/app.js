const _ = require('lodash')
const KrakenClient = require('kraken-api')
const BinanceClient = require('node-binance-api')()
const Promise = require('bluebird')
const Mysql = require('./client/mysql')
const config = require('../config.json')

const mysql = new Mysql(config.mysql)
const kraken = new KrakenClient(config.kraken.key, config.kraken.secret)
const binance = BinanceClient.options({
  APIKEY: config.binance.key,
  APISECRET: config.binance.secret,
  useServerTime: true,
  test: false,
})

async function fetchKraken () {
  const responses = await kraken.api('Ticker', { pair : config.pairs.kraken.join(',') })

  return Object.entries(responses.result).reduce((prices, [key, info]) => {
    prices[key] = Number(info.c[0])
    return prices
  }, {})
}

async function fetchBinance () {
  return new Promise((resolve, reject) => {
    binance.prices((error, data) => {
      return error
        ? reject(error)
        : resolve(_(data).pick(config.pairs.binance).mapValues(Number).value())
    })
  })
}


async function tick () {
  console.log("Fetching data with timestamp:", new Date())

  const rates = await Promise.props({
    kraken: fetchKraken(),
    binance: fetchBinance()
  })

  const rowData = {
    date: new Date()
  }

  Object.entries(rates).forEach(([stock, prices]) => {
    Object.entries(prices).forEach(([key, price]) => {
      rowData[`${stock}_${key}`] = price
    })
  })

  await mysql.insert(config.mysql.table, rowData)

  setTimeout(tick, config.interval)
}

tick()