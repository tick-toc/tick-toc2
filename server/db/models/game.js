const Sequelize = require('sequelize')
const db = require('../db')

const Game = db.define('game', {
  modules: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      notEmpty: true
    }
  },
  modulesFailed: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      notEmpty: true
    }
  },
  startTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 300
  },
  endTime: {
    type: Sequelize.INTEGER
  },
  strikesAllowed: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 3,
    validate: {
      notEmpty: true
    }
  },
  strikes: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 3,
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: Sequelize.ENUM('passed', 'failed', 'active'),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Game
