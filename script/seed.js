// 'use strict'

// const db = require('../server/db')
// const {User, Game} = require('../server/db/models')

// const gameData = [
//   {
//     modules: 5,
//     modulesFailed: 2,
//     startTime: 300,
//     endTime: 120,
//     strikesAllowed: 3,
//     strikes: 2,
//     status: 'passed'
//   },
//   {
//     modules: 5,
//     modulesFailed: 2,
//     startTime: 300,
//     endTime: 0,
//     strikesAllowed: 3,
//     strikes: 2,
//     status: 'failed'
//   },
//   {
//     modules: 5,
//     modulesFailed: 3,
//     startTime: 300,
//     endTime: 57,
//     strikesAllowed: 3,
//     strikes: 2,
//     status: 'failed'
//   }
// ]

// const userData = [
//   {
//     userName: 'dummyUser',
//     email: 'dummyUser@dummyemail.com',
//     password: 'dummypassword'
//   },
//   {
//     userName: 'smartUser',
//     email: 'smartUser@smartemail.com',
//     password: 'smartpassword'
//   }
// ]

// async function seed() {
//   await db.sync({force: true})
//   console.log('db synced!')

//   const [game, user] = await Promise.all([
//     Game.bulkCreate(gameData, {returning: true}),
//     User.bulkCreate(userData, {individualHooks: true, returning: true})
//   ])

//   const [game1, game2, game3] = game
//   const [user1, user2] = user

//   await game1.setUser(user2)
//   await game2.setUser(user1)
//   await game3.setUser(user1)

//   console.log(`seeded ${user.length} users`)
//   console.log(`seeded successfully`)
// }

// // We've separated the `seed` function from the `runSeed` function.
// // This way we can isolate the error handling and exit trapping.
// // The `seed` function is concerned only with modifying the database.
// async function runSeed() {
//   console.log('seeding...')
//   try {
//     await seed()
//   } catch (err) {
//     console.error(err)
//     process.exitCode = 1
//   } finally {
//     console.log('closing db connection')
//     await db.close()
//     console.log('db connection closed')
//   }
// }

// // Execute the `seed` function, IF we ran this module directly (`node seed`).
// // `Async` functions always return a promise, so we can use `catch` to handle
// // any errors that might occur inside of `seed`.
// if (module === require.main) {
//   runSeed()
// }

// // we export the seed function for testing purposes (see `./seed.spec.js`)
// module.exports = seed
