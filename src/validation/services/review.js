const Review = require('~/models/review')
const { validateRequired, validateType, validateLength, validateFunc } = require('~/utils/validationHelper');
const errors = require('~/consts/errors');
const validation = require('~/consts/validation');
const allowedReviewFieldsForUpdate = {
  comment: true,
  rating: true
}

const isAuthor = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: reviewId } = req.params;

  try {
    validateRequired('userId', true, userId);
    validateType('userId', 'string', userId);
    validateLength('userId', { min: validation.lengths.MIN_NAME_LENGTH, max: validation.lengths.MAX_NAME_LENGTH }, userId);

    validateRequired('reviewId', true, reviewId);
    validateType('reviewId', 'string', reviewId);
    validateLength('reviewId', { min: validation.lengths.MIN_NAME_LENGTH, max: validation.lengths.MAX_NAME_LENGTH }, reviewId);
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({ message: errors.DOCUMENT_NOT_FOUND('Review').message });
  }

  if (review.author.toString() !== userId) {
    return res.status(403).json({ message: errors.FORBIDDEN.message });
  }

  next();
};

module.exports = {
  allowedReviewFieldsForUpdate,
  isAuthor
}

module.exports = {
  allowedReviewFieldsForUpdate,
  isAuthor
}
