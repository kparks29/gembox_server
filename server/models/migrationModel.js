import mysql from 'mysql2'
import Promise from 'promise'
import _ from 'lodash'

export default class Migration {
	constructor (queries) {
		this.queries = queries
		return this.setupConnection().then(() => {
			return this.runQueries()
		}).then(() => {
			return this.commitTransaction()
		})
	}
	runQueries () {
		let promises = []
		_.each(this.queries, (query) => {
			promises.push(this.runQuery(query))
		})
		return Promise.all(promises)
	}
	runQuery (query) {
		return new Promise((resolve, reject) => {
			this.connection.query(query, (err, result) => {
				if (err) {
					console.log(`error on ${query}`)
					return this.connection.rollback(() => {
						reject(err)
					})
				}
				resolve(result)
			})
		})
	}
	commitTransaction () {
		return new Promise((resolve, reject) => {
			this.connection.commit((err) => {
				if (err) {
					return this.connection.rollback(() => {
						reject(err)
					})
				}
				resolve('Done')
				this.connection.end()
			})
		})
	}
	setupConnection () {
		this.connection = mysql.createConnection(process.env['GEMBOX_DB_URL'])
		this.connection.connect()
		return new Promise((resolve, reject) => {
			this.connection.beginTransaction((err) => {
				if (err) {
					reject(err)
				}
				resolve()
			})
		})
	}
}