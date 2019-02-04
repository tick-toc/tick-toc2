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
  // need req.body
  // need req.session.passport.user
  try {
    const userId = req.session.passport.user
    // const result = Game.create({ where: {

    // }})
    const result = await Game.create({
      userId
    })
    console.log(req.body, '<<<BODY')
    console.log(req.session, '<<<SESSION')
    res.json(result)
  } catch (err) {
    next(err)
  }

  // } catch (err) {
  //   next(err)
  // }
})
