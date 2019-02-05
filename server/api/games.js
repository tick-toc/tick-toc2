const router = require('express').Router()
const {Game, User} = require('../db/models')
module.exports = router

router.get('/:offset', async (req, res, next) => {
  try {
    const {offset} = req.params
    const limit = 50
    const games = await Game.findAll({
      offset,
      limit,
      include: [User],
      order: [['finishTime', 'ASC']]
    })
    res.json({games, limit})
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const userId = req.session.passport.user
    const {
      strikeCount,
      strikeTotal: strikesAllowed,
      startTime,
      finishTime,
      moduleTotal
    } = req.body
    const status = strikeCount === strikesAllowed ? 'failed' : 'passed'

    const result = await Game.create({
      userId,
      status,
      moduleTotal,
      startTime,
      finishTime,
      strikesAllowed
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
