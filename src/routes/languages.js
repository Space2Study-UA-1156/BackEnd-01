const router = require('express').Router({ mergeParams: true })
const asyncWrapper = require('~/middlewares/asyncWrapper')
const languagesController = require('~/controllers/languages')

router.get('/', asyncWrapper(languagesController.getLanguages))

module.exports = router
