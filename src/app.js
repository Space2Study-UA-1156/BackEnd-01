require('module-alias/register')
require('../module-aliases')
require('~/initialization/envSetup')
require('~/initialization/firebaseStorage')
const express = require('express')
const serverSetup = require('~/initialization/serverSetup')
const logger = require('~/logger/logger')

const app = express()

const start = async () => {
  try {
    await serverSetup(app)
  } catch (err) {
    logger.error(err)
  }
}

start()
