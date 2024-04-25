const router = require('express').Router()
module.exports = router

// router.use('/users', require('./users'))
router.use('/movies', require('./movies'))
router.use('/actors', require('./actors'))
router.use('/receivers', require('./receivers'))
router.use('/quarterbacks', require('./quarterbacks'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
