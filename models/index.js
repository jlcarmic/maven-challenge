const Sequelize = require('sequelize')
const allConfigs = require('../config/sequelize')
const NumbersModel = require('./numbers')

const environment = process.env.NODE_ENV || 'development'
const { dialect, storage } = allConfigs[environment]

const connection = new Sequelize({ dialect, storage })

const Numbers = NumbersModel(connection, Sequelize)

module.exports = { Numbers }
