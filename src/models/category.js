const { Schema, model } = require('mongoose')
const { OFFER, CATEGORY } = require('~/consts/models')
const errors = require('~/consts/errors')

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, errors.FIELD_IS_NOT_DEFINED('name').message]
    },
    appearance: {
      path: {
        type: String,
        required: [true, errors.FIELD_IS_NOT_DEFINED('appearance.path').message]
      },
      color: {
        type: String,
        required: [true, errors.FIELD_IS_NOT_DEFINED('appearance.color').message]
      }
    },
    totalOffers: {
      student: {
        type: Number,
        ref: OFFER,
        default: 0
      },
      tutor: {
        type: Number,
        ref: OFFER,
        default: 0
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model(CATEGORY, categorySchema)
