const Review = require('~/models/review')

const allowedReviewFieldsForUpdate = {
  comment: true,
  rating: true
}

const isAuthor = async (req, res, next) => {
  const { id: userId } = req.user
  const { id: reviewId } = req.params

  const review = await Review.findById(reviewId)

  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }

  if (review.author.toString() !== userId) {
    return res.status(403).json({ message: 'You do not have permission to perform this action' })
  }

  next()
}

module.exports = {
  allowedReviewFieldsForUpdate,
  isAuthor
}
