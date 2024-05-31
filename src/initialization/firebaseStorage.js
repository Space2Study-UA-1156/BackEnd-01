const { initializeApp } = require('firebase/app')
const { getStorage } = require('firebase/storage')
const { firebaseAccess } = require('~/configs/config')

initializeApp(firebaseAccess)
const storage = getStorage()

module.exports = storage
