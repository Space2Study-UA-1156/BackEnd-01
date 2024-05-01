const Comment = require('~/models/comment')

const commentService = {
  addComment: async (data) => {
    const { text, author, authorRole, cooperationId } = data
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
  getComments: async (cooperationId) => {
    return await Comment.find({ cooperation: cooperationId }).select('-authorRole').populate({
      path: 'author',
      select: 'firstName lastName'
    })
  }
}

module.exports = commentService
