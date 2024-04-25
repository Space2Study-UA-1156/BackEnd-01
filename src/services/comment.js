const Comment = require('~/models/comment')

const commentService = {
  addComment: async (data) => {
    const { text, author, authorRole, cooperationId } = data
    const commentData = {
      author,
      text,
      cooperation: cooperationId,
      authorRole
    }
    let comment = new Comment(commentData)
    await comment.save()
    comment = await Comment.findById(comment._id).populate({
      path: 'author',
      select: 'firstName lastName'
    })

    const result = {
      _id: comment._id,
      author: {
        _id: comment.author._id,
        firstName: comment.author.firstName,
        lastName: comment.author.lastName
      },
      text: comment.text,
      cooperation: comment.cooperation,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }

    return result
  },

  getComments: async (cooperationId) => {
    return await Comment.find({ cooperation: cooperationId }).populate({
      path: 'author',
      select: 'firstName lastName'
    })
  }
}

module.exports = commentService
