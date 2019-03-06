const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const app = require('../src/api/index')

// More of a POC of a test
describe ('API', () => {
	describe('External', function () {
        this.timeout(5000)

	    it('Search for a book', (done) => {
	        request(app)
	            .get('/api/external-books?name=A%20Game%20of%20Thrones')
	            .set('Content-Type', 'application/json')
	            .end((err, res) => {
	                expect(res.body.status_code).to.equal(200)
	                expect(res.body.status).to.equal('success')
	                expect(res.body.data[0]).to.exist
	                done()
	            })
	    })

	    it('Search empty', (done) => {
	        request(app)
	            .get('/api/external-books')
	            .set('Content-Type', 'application/json')
	            .end((err, res) => {
	                expect(res.body.status_code).to.equal(200)
	                expect(res.body.status).to.equal('success')
	                expect(res.body.data).to.eql([])
	                done()
	            })
	    })
	})


	describe('Internal', function () {
        before((done) => {
            // BOOTSTRAP
            setTimeout(() => {
                done()
            }, 500)
        })


        it('Creates a newbook1', (done) => {
            let newbook1 = {
                "id": '1',
                "name": "A Clash of Kings",
                "isbn": "122",
                "number_of_pages": 100,
                "author": ["George Martin"],
                "publisher": "Bantam books",
                "country": "US",
                "release_date": "1999-02-01"
            }

            request(app)
                .post('/api/v1/books')
                .set('Content-Type', 'application/json')
                .send(newbook1)
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.data[0].id).to.equal(newbook1.id)
                    expect(res.body.data[0].name).to.equal(newbook1.name)
                    done()
                })
        })

        it('Gets the newbook1', (done) => {
            request(app)
                .get(`/api/v1/books/1`)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.data.id).to.equal('1')
                    done()
                })
        })

        it('Creates a newbook2', (done) => {
            let newbook2 = {
                "id": '2',
                "name": "A Clash of Kings 2",
                "isbn": "122",
                "number_of_pages": 100,
                "author": ["George Martin"],
                "publisher": "Bantam books",
                "country": "US",
                "release_date": "1999-02-01"
            }
            request(app)
                .post('/api/v1/books')
                .set('Content-Type', 'application/json')
                .send(newbook2)
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.data[0].id).to.equal(newbook2.id)
                    expect(res.body.data[0].name).to.equal(newbook2.name)
                    done()
                })
        })

        it('Gets all books', (done) => {
            request(app)
                .get(`/api/v1/books`)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.data.length).to.equal(2)
                    done()
                })
        })

        it('Updates newbook2 via POST', (done) => {
            request(app)
                .post(`/api/v1/books/2/update`)
                .set('Content-Type', 'application/json')
                .send({name: "Another name"})
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.data.id).to.equal('2')
                    expect(res.body.message).to.equal('The book was updated successfully.')
                    done()
                })
        })

        it('Gets the updated newbook2', (done) => {
            request(app)
                .get(`/api/v1/books/2`)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.data.id).to.equal('2')
                    expect(res.body.data.name).to.equal('Another name')
                    done()
                })
        })

        it('Updates newbook2 via PATCH', (done) => {
            request(app)
                .patch(`/api/v1/books/2`)
                .set('Content-Type', 'application/json')
                .send({country: "Sweden"})
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.data.id).to.equal('2')
                    expect(res.body.message).to.equal('The book was updated successfully.')
                    done()
                })
        })

        it('Gets the updated newbook2', (done) => {
            request(app)
                .get(`/api/v1/books/2`)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.data.id).to.equal('2')
                    expect(res.body.data.country).to.equal('Sweden')
                    done()
                })
        })

        it('Deletes newbook2 via DEL', (done) => {
            request(app)
                .delete(`/api/v1/books/2`)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.message).to.equal('The book was deleted successfully.')
                    done()
                })
        })

        it('Deletes newbook1 via POST', (done) => {
            request(app)
                .post(`/api/v1/books/1/delete`)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.message).to.equal('The book was deleted successfully.')
                    done()
                })
        })

        it('Gets all books, check 0', (done) => {
            request(app)
                .get(`/api/v1/books`)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    expect(res.body.status_code).to.equal(200)
                    expect(res.body.status).to.equal('success')
                    expect(res.body.data.length).to.equal(0)
                    done()
                })
        })




	})
})