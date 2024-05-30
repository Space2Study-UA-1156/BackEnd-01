const Request = require('~/models/request')
const { createForbiddenError, createError } = require('~/utils/errorsHelper')
const {
  enums: { MAIN_ROLE_ENUM }
} = require('~/consts/validation')
const { DOCUMENT_NOT_FOUND } = require('~/consts/errors')
const { REQUEST } = require('~/consts/models')
const categoryService = require('~/services/category')
const { allowedRequestFieldsForUpdate } = require('~/validation/services/request')
const filterAllowedFields = require('~/utils/filterAllowedFields')

const getRequests = async (skip, limit, role, userId) => {
  const searchFilter = MAIN_ROLE_ENUM.includes(role) ? { author: userId } : {}

  const requests = await Request.find(searchFilter)
    .skip(skip)
    .limit(limit)
    .populate('author', 'firstName lastName photo')
    .exec()
  const count = await Request.countDocuments(searchFilter)

  return {
    count,
    items: requests
  }
}

const getRequestById = async (id, userId) => {
  const request = await Request.findOne({ _id: id, author: userId })
    .populate('author', 'firstName lastName photo')
    .exec()

  if (!request) {
    throw createError(404, DOCUMENT_NOT_FOUND(REQUEST))
  }

  return request
}

const createRequest = async (subject, categoryName, categoryId, information, author) => {
  const category = await categoryService.getCategoryById(categoryId)

  return await Request.create({
    subject,
    information,
    author,
    categoryId,
    categoryName: !categoryId ? categoryName : category.name
  })
}

const deleteRequest = async (id, userId) => {
  const request = await Request.findById(id).exec()

  if (request.author.toString() !== userId) {
    throw createForbiddenError()
  }

  return await Request.findByIdAndRemove(id).exec()
}

const updateRequest = async (id, userId, updateData) => {
  const filteredUpdateData = filterAllowedFields(updateData, allowedRequestFieldsForUpdate)

  const request = await Request.findById(id).exec()

  if (request.author.toString() !== userId) {
    throw createForbiddenError()
  }

  for (let field in filteredUpdateData) {
    request[field] = filteredUpdateData[field]
  }

  if (filteredUpdateData.categoryId) {
    const category = await categoryService.getCategoryById(filteredUpdateData.categoryId)
    request.categoryName = category.name
  } else {
    request.categoryId = null
  }

  await request.validate()
  await request.save()
}

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  deleteRequest,
  updateRequest
}
