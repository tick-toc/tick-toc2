const router = require('express').Router()
const {Game, User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const games = await Game.findAll({
      where: {
        status: 'diffused'
      },
      include: [User],
      order: [['solveTime', 'ASC']]
    })
    res.json({games})
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const userId = req.session.passport.user
    const {
      strikeTotal: strikesAllowed,
      startTime,
      finishTime,
      moduleTotal,
      status
    } = req.body
    const solveTime = startTime - finishTime

    const result = await Game.create({
      userId,
      status,
      moduleTotal,
      startTime,
      finishTime,
      strikesAllowed,
      solveTime
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/previous/:offset', async (req, res, next) => {
  try {
    const {offset} = req.params
    const limit = 20
    const userId = req.session.passport.user
    const games = await Game.findAll({
      where: {
        userId
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })
    res.send({games, limit})
  } catch (err) {
    next(err)
  }
})

// need to refactor route to take in offset from axios request
