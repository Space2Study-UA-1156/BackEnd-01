const getRegex = require('~/utils/getRegex')

const categoriesAggregateOptions = (query) => {
  const {
    limit = 100,
    name = '',
    skip = 0,
    sort = 'createdAt'
  } = query

  const matchStage = {
    $match: {
      name: getRegex(name),
      subjects: { $exists: true, $ne: [] }
    }
  }

  let sortOption = {}

  if (sort) {
    try {
      const parsedSort = JSON.parse(sort)
      const { order, orderBy } = parsedSort
      const sortOrder = order === 'asc' ? 1 : -1
      sortOption = { [orderBy]: sortOrder }
    } catch {
      if (typeof sort === 'string') {
        if (sort === 'totalOffersAsc') {
          sortOption['totalOffersSum'] = 1
        } else if (sort === 'totalOffersDesc') {
          sortOption['totalOffersSum'] = -1
        } else {
          sortOption[sort] = -1
        }
      }
    }
  }

  return [
    {
      $lookup: {
        from: 'subjects',
        localField: '_id',
        foreignField: 'category',
        as: 'subjects'
      }
    },
    matchStage,
    {
      $addFields: {
        totalOffersSum: { $add: ['$totalOffers.student', '$totalOffers.tutor'] }
      }
    },
    {
      $facet: {
        items: [
          { $sort: sortOption },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) }
        ],
        count: [matchStage, { $count: 'count' }]
      }
    },
    {
      $project: {
        items: {
          $map: {
            input: '$items',
            as: 'item',
            in: {
              _id: '$$item._id',
              name: '$$item.name',
              appearance: '$$item.appearance',
              totalOffers: '$$item.totalOffers',
              createdAt: '$$item.createdAt',
              updatedAt: '$$item.updatedAt'
            }
          }
        },
        count: {
          $cond: {
            if: { $eq: ['$count', []] },
            then: 0,
            else: { $arrayElemAt: ['$count.count', 0] }
          }
        }
      }
    }
  ]
}

module.exports = categoriesAggregateOptions
