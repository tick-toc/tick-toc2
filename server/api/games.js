const router = require('express').Router()
const {Game} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const games = await Game.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
    })
    res.json(games)
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
    const result = await Game.findAll({
      where: {
        userId
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })
    res.send({games: [...result], limit})
  } catch (err) {
    next(err)
  }
})

// need to refactor route to take in offset from axios request
