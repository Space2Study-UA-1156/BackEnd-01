const Comment = require('~/models/comment')
const Cooperation = require('~/models/cooperation')
const { createForbiddenError } = require('~/utils/errorsHelper')

const commentService = {
  addComment: async (data) => {
    const { text, author, authorRole, cooperationId } = data

    const cooperation = await Cooperation.findById(cooperationId)
    if (cooperation.initiator.toString() !== author && cooperation.receiver.toString() !== author) {
      throw createForbiddenError()
    }

    const comment = await Comment.create({
      author,
      text,
      cooperation: cooperationId,
      authorRole
    })
    return await Comment.findById(comment._id).select('-authorRole').populate({
      path: 'author',
      select: 'firstName lastName'
    })
  },
  getComments: async (cooperationId, userId) => {
    const cooperation = await Cooperation.findById(cooperationId)
    if (cooperation.initiator.toString() !== userId && cooperation.receiver.toString() !== userId) {
      throw createForbiddenError()
    }

    return await Comment.find({ cooperation: cooperationId }).select('-authorRole').populate({
      path: 'author',
      select: 'firstName lastName'
    })
  }
}

module.exports = commentService
