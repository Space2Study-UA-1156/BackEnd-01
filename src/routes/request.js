const router = require('express').Router()

const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')

const requestController = require('~/controllers/request')
const Request = require('~/models/request')
const Category = require('~/models/category')

const body = [{ model: Category, idName: 'categoryId' }]
const params = [{ model: Request, idName: 'id' }]

router.use(authMiddleware)
router.param('id', idValidation)

console.log(requestController)

router.get('/', asyncWrapper(requestController.getRequests))
router.post('/', isEntityValid({ body }), asyncWrapper(requestController.createRequest))
router.get('/:id', isEntityValid({ params }), asyncWrapper(requestController.getRequestById))
router.delete('/:id', isEntityValid({ params }), asyncWrapper(requestController.deleteRequest))
router.patch('/:id', isEntityValid({ params }), asyncWrapper(requestController.updateRequest))

module.exports = router
