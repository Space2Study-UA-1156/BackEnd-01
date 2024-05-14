const { Schema, model } = require('mongoose')
const Category = require('~/models/category')
const Subject = require('~/models/subject')
const {
  enums: {
    MAIN_ROLE_ENUM,
    SPOKEN_LANG_ENUM,
    PROFICIENCY_LEVEL_ENUM,
    OFFER_STATUS_ENUM
  }
} = require('~/consts/validation')
const { USER, SUBJECT, CATEGORY, OFFER } = require('~/consts/models')
const {
  ENUM_CAN_BE_ONE_OF,
  FIELD_CANNOT_BE_EMPTY,
  VALUE_MUST_BE_ABOVE,
  FIELD_CANNOT_BE_SHORTER,
  FIELD_CANNOT_BE_LONGER,
  FIELD_MUST_BE_SELECTED
} = require('~/consts/errors')

const offerSchema = new Schema(
  {
    price: {
      type: Number,
      required: [true, FIELD_CANNOT_BE_EMPTY('price')],
      min: [1, VALUE_MUST_BE_ABOVE('price', 1)]
    },
    proficiencyLevel: {
      type: [String],
      enum: {
        values: PROFICIENCY_LEVEL_ENUM,
        message: ENUM_CAN_BE_ONE_OF('proficiencyLevel', PROFICIENCY_LEVEL_ENUM)
      },
      required: [true, FIELD_CANNOT_BE_EMPTY('proficiencyLevel')]
    },
    title: {
      type: String,
      minLength: [1, FIELD_CANNOT_BE_SHORTER('title', 1)],
      maxLength: [100, FIELD_CANNOT_BE_LONGER('title', 100)],
      required: [true, FIELD_CANNOT_BE_EMPTY('title')],
      trim: true
    },
    description: {
      type: String,
      minLength: [1, FIELD_CANNOT_BE_SHORTER('description', 1)],
      maxLength: [1000, FIELD_CANNOT_BE_LONGER('description', 1000)],
      required: [true, FIELD_CANNOT_BE_EMPTY('description')],
      trim: true
    },
    languages: {
      type: [String],
      enum: {
        values: SPOKEN_LANG_ENUM,
        message: ENUM_CAN_BE_ONE_OF('language', SPOKEN_LANG_ENUM)
      },
      required: [true, FIELD_MUST_BE_SELECTED('language')]
    },
    authorRole: {
      type: String,
      enum: {
        values: MAIN_ROLE_ENUM,
        message: ENUM_CAN_BE_ONE_OF('authorRole', MAIN_ROLE_ENUM),
        required: [true, FIELD_MUST_BE_SELECTED('authorRole')]
      }
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: true
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: SUBJECT,
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: CATEGORY,
      required: true
    },
    status: {
      type: String,
      enum: {
        values: OFFER_STATUS_ENUM,
        message: ENUM_CAN_BE_ONE_OF('status', OFFER_STATUS_ENUM)
      },
      default: OFFER_STATUS_ENUM[0]
    },
    FAQ: {
      type: [
        {
          question: {
            type: String,
            required: [true, FIELD_CANNOT_BE_EMPTY('question')],
            trim: true
          },
          answer: {
            type: String,
            required: [true, FIELD_CANNOT_BE_EMPTY('answer')],
            trim: true
          }
        }
      ]
    }
  },
  {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

offerSchema.statics.calcTotalOffers = async function(category, subject, authorRole) {
  const categoryTotalOffersQty = await this.countDocuments({ category, authorRole })
  await Category.findByIdAndUpdate(category, { $set: { [`totalOffers.${authorRole}`]: categoryTotalOffersQty } }).exec()
  const subjectTotalOffersQty = await this.countDocuments({ subject, authorRole })
  await Subject.findByIdAndUpdate(subject, { $set: { [`totalOffers.${authorRole}`]: subjectTotalOffersQty } }).exec()
}

offerSchema.post('save', async function(doc) {
  doc.constructor.calcTotalOffers(doc.category, doc.subject, doc.authorRole)
})

offerSchema.post('findOneAndRemove', async function(doc) {
  doc.constructor.calcTotalOffers(doc.category, doc.subject, doc.authorRole)
})

module.exports = model(OFFER, offerSchema)
