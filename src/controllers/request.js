const requestService = require('~/services/request')

const getRequests = async (req, res) => {
  const { skip, limit } = req.query
  const { role, id: userId } = req.user

  const requests = await requestService.getRequests(parseInt(skip), parseInt(limit), role, userId)

  res.status(200).json(requests)
}

const getRequestById = async (req, res) => {
  const { id } = req.params
  const { id: userId } = req.user

  const request = await requestService.getRequestById(id, userId)

  res.status(200).json(request)
}

const createRequest = async (req, res) => {
  const { subject, categoryName, categoryId, information } = req.body
  const { id: currentUserId } = req.user

  const newRequest = await requestService.createRequest(subject, categoryName, categoryId, information, currentUserId)

  res.status(201).json(newRequest)
}

const deleteRequest = async (req, res) => {
  const { id } = req.params
  const { id: userId } = req.user

  await requestService.deleteRequest(id, userId)

  res.status(204).end()
}

const updateRequest = async (req, res) => {
  const { id } = req.params
  const { id: userId } = req.user
  const updateData = req.body

  await requestService.updateRequest(id, userId, updateData)

  res.status(204).end()
}

module.exports = { getRequests, getRequestById, createRequest, deleteRequest, updateRequest }
