import express from 'express'
import { restaurantsListing } from './modules/restaurants/restaurant.controller'

const router = express.Router()

router.get('/restaurants/list',restaurantsListing)

module.exports = router