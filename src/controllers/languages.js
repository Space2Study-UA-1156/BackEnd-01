const { enums } = require('~/consts/validation')

const getLanguages = async (_req, res) => {
  res.status(200).json(enums.SPOKEN_LANG_ENUM)
}

module.exports = {
  getLanguages
}
