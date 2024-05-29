const { Schema, model } = require('mongoose')
const { REQUEST, CATEGORY, USER } = require('~/consts/models')
const {
  FIELD_CANNOT_BE_EMPTY,
  FIELD_CANNOT_BE_SHORTER,
  FIELD_CANNOT_BE_LONGER,
  ENUM_CAN_BE_ONE_OF
} = require('~/consts/errors')
const {
  enums: { REQUEST_STATUS_ENUM }
} = require('~/consts/validation')

const requestSchema = new Schema(
  {
    subject: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('subject')],
      trim: true
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: CATEGORY,
      default: null
    },
    categoryName: {
      type: String,
      default: '',
      required: [true, FIELD_CANNOT_BE_EMPTY('categoryName')]
    },
    information: {
      type: String,
      minLength: [20, FIELD_CANNOT_BE_SHORTER('information', 20)],
      maxLength: [1000, FIELD_CANNOT_BE_LONGER('information', 1000)],
      required: [true, FIELD_CANNOT_BE_EMPTY('information')],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: REQUEST_STATUS_ENUM,
        message: ENUM_CAN_BE_ONE_OF('status', REQUEST_STATUS_ENUM)
      },
      default: REQUEST_STATUS_ENUM[0]
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: USER
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

requestSchema.index({ subject: 1, categoryName: 1 }, { unique: true })

module.exports = model(REQUEST, requestSchema)
