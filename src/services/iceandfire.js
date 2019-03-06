const axios = require('axios')
const models = require('../models')

const getBookByName = async (book) => {
	try {
		return (await axios.get(`https://www.anapioficeandfire.com/api/books?name=${book}`))
			.data
			.map(b => models.books.transformIceAndFireAPI(b))
	} catch (err) {
		console.err(err)
		return []
	}
}

module.exports = {
	getBookByName	
}


if (require.main === module) {
    let run = async function () {
    	console.log(await getBookByName('A Game of Thrones'))
    }

    run ()
}