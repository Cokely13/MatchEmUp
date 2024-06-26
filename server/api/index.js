const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/movies', require('./movies'))
router.use('/actors', require('./actors'))
router.use('/receivers', require('./receivers'))
router.use('/quarterbacks', require('./quarterbacks'))
router.use('/artists', require('./artists'))
router.use('/albums', require('./albums'))
router.use('/songs', require('./songs'))
router.use('/players', require('./players'))
router.use('/franchises', require('./franchises'))
router.use('/states', require('./states'))
router.use('/cities', require('./cities'))
router.use('/actors', require('./actors'))
router.use('/shows', require('./shows'))
router.use('/shows', require('./shows'))
router.use('/wins', require('./wins'))
router.use('/losses', require('./losses'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
