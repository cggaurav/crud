const express = require('express')
const router = express.Router()

const models = require('../../models')
const services = require('../../services')

//TODO: Bring this from config
const version = 'v1'

router.get('/external-books', async (req, res) => {
	try {
		res.json({
			status_code: 200,
			status: "success",
			data: await services.iceandfire.getBookByName(req.query.name)
		})
	} catch (err) {
		console.log(err)
	}
})

router.post(`/${version}/books`, async (req, res) => {
	try {
		let book = await models.books.create(req.body)
		res.json({
			status_code: 200,
			status: "success",
			data: book
		})
	} catch (err) {
		console.log(err)
		// TODO

	}
})

router.get(`/${version}/books`, async (req, res) => {
	try {
		res.json({
			status_code: 200,
			status: "success",
			data: await models.books.getAll()
		})
	} catch (err) {
		console.log(err)
		// TODO

	}
})

router.get(`/${version}/books/:id`, async (req, res) => {
	try {
		res.json({
			status_code: 200,
			status: "success",
			data: await models.books.getById(req.params.id)
		})
	} catch (err) {
		console.log(err)
		// TODO

	}
})

router.patch(`/${version}/books/:id`, async (req, res) => {
	try {
		res.json({
			status_code: 200,
			status: "success",
			message: "The book was updated successfully.",
			data: await models.books.updateById(req.params.id, req.body)
		})
	} catch (err) {
		console.log(err)
		// TODO

	}
})

router.post(`/${version}/books/:id/update`, async (req, res) => {
	try {
		res.json({
			status_code: 200,
			status: "success",
			message: "The book was updated successfully.",
			data: await models.books.updateById(req.params.id, req.body)
		})
	} catch (err) {
		console.log(err)
		// TODO

	}
})

router.post(`/${version}/books/:id/delete`, async (req, res) => {
	try {
		await models.books.deleteById(req.params.id)
		res.json({
			status_code: 200,
			status: "success",
			message: "The book was deleted successfully.",
			data: []
		})
	} catch (err) {
		console.log(err)
		// TODO

	}
})

router.delete(`/${version}/books/:id`, async (req, res) => {
	try {
		await models.books.deleteById(req.params.id)
		res.json({
			status_code: 200,
			status: "success",
			message: "The book was deleted successfully.",
			data: []
		})
	} catch (err) {
		console.log(err)
		// TODO

	}
})

module.exports = router