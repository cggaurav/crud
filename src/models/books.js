const config = require('config')
const mongodb = require('mongodb')
const MongoClient = require('mongodb').MongoClient

const moment = require('moment')

class Books {
	// Why mongodb, more as a matter of convenience. The data is pretty structured and we could go either way.
	// This could be cassandra here as the storage driver
	constructor (table=`books_${Date.now()}`, store='mongodb') {
		this.table = table
		this.indexes = [] // TODO
		this.connect()
	}

	// CAVEAT: This module managed connection as well.
	// TODO: Handle a connection pool, multiple connections, ideally should be moved out to get a connection
	async connect () {
		if (!this.store) {
			console.log('Connecting to datastore')
			this.client = (await MongoClient.connect(config.api.mongodb.url))
			this.db = this.client.db(config.api.mongodb.name)
			this.store = this.db.collection(this.table)
			await this.index()
		}
	}

	async index () {
		// console.log('Creating indexes')
		// https://docs.mongodb.com/manual/reference/method/db.collection.ensureIndex/#db.collection.ensureIndex
		await this.store.createIndex({ "id": 1 }, { unique: true })
		await this.store.createIndex({ "name": 1 }, null)
		await this.store.createIndex({ "country": 1 }, null)
		await this.store.createIndex({ "publisher": 1 }, null)
		await this.store.createIndex({ "release_date": 1 }, null)
	}

	async getAll () {
		await this.connect()
		return (await this.store.find({}).toArray()).map(b => this.removeID(b))
	}

	// TODO: Move pointer to the new book
	async getById (id) {
		await this.connect()
		return (await this.store.find({id: id}).toArray()).map(b => this.removeID(b))[0]
	}

	async updateById (id, book) {
		return [
			(await this.store.findOneAndUpdate({id: id}, { $set: book }, { returnNewDocument: true })).value
		]
		.map(b => this.removeID(b))[0]
	}

	async deleteById (id) {
		await this.store.deleteOne({id: id})
	}

	async create(book) {
		return (await this.store.insertMany([book])).ops.map(b => this.removeID(b))
	}

	validate (book) {
		// JSONSchema.validate(this, this.schema())
		return true
	}

	// Specific
	removeID (book) {
		delete book['_id']
		return book
	}

	transformIceAndFireAPI (book) {
		return {
			// id: book.url,
			name: book.name,
			isbn: book.isbn,
			number_of_pages: book.numberOfPages,
			publisher: book.publisher,
			country: book.country,
			authors: book.authors,
			release_date: book.released.split('T')[0], // TODO: Move this elsewhere
		}
	}

	// TEST
	async seed () {
		console.log('Seeding..')
		try {
			// TODO
			// await this.store.insertMany([])
		} catch (e) {
			// console.log('We have done this before')
		}
	}
}

// Kind of like unit tests
if (require.main === module) {
    let run = async function () {
    	let key = `booktest_${Date.now()}`
        let B = new Books(key)

        console.log(`Collection: ${key}`)

        let newbook1 = {
        	"id": "1",
        	"name": "A Clash of Kings",
        	"isbn": "122",
        	"number_of_pages": 100,
        	"author": ["George Martin"],
        	"publisher": "Bantam books",
        	"country": "US",
        	"release_date": "1999-02-01"
        }

        let newbook2 = {
        	"id": "200",
        	"name": "A Clash of Kings 2",
        	"isbn": "122",
        	"number_of_pages": 100,
        	"author": ["George Martin"],
        	"publisher": "Bantam books",
        	"country": "US",
        	"release_date": "1999-02-01"
        }

        setTimeout(async () => {
        	console.log('Creating a book')
        	console.log(await B.create(newbook1))
        	console.log(await B.create(newbook2))
        	console.log(await B.getAll())
        	console.log('Get by Id')
        	console.log(await B.getById('1'))
        	console.log('Update by Id')
        	console.log(await B.updateById('1', {name: 'Another name'}))
        	console.log(await B.getById('1'))
        	console.log(await B.getAll())
        	console.log('Delete by Id')
        	console.log(await B.deleteById('1'))
        	console.log(await B.getAll())
        }, 2000)
    }

    run ()
}

module.exports = new Books()