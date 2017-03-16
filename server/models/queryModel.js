import mysql from 'mysql2'
import Promise from 'promise'
import _ from 'lodash'

export default class Query {
	constructor (...queries) {
		this.queries = queries
		this.promise = Promise
		return this.setupConnection().then(() => {
			return this.runQueries()
		}).then((results) => {
			return this.commitTransaction(results)
		})
	}
	runQueries () {
		let promises = []
		_.each(this.queries, (query) => {
			promises.push(this.runQuery(query.sql, query.values))
		})
		return Promise.all(promises)
	}
	runQuery (query, values) {
		return new Promise((resolve, reject) => {
			let options = {
				sql: query,
				values,
				typeCast: this.convertToBoolean
			}
			this.connection.query(options, (queryError, result) => {
				if (queryError) {
					return this.connection.rollback(() => {
						reject(queryError)
					})
				}
				resolve(result)
			})
		})
	}
	convertToBoolean (field, next) {
		if (field.type === 'TINY' && field.length === 1) {
			return (field.string() === '1')
		}
		return next()
	}
	commitTransaction (results) {
		return new Promise((resolve, reject) => {
			this.connection.commit((commitError) => {
				if (commitError) {
					return this.connection.rollback((rollbackError) => {
						if (rollbackError) {
							reject(rollbackError)
						}
						this.connection.end(() => {
							reject(commitError)
						})
					})
				}
				this.connection.end((connectionEndError) => {
					if (connectionEndError) {
						reject(connectionEndError)
					}
					resolve(results)
				})
			})
		})
	}
	setupConnection () {
		this.connection = mysql.createConnection(process.env['GEMBOX_DB_URL'])
		return new Promise((resolve, reject) => {
			this.connection.connect((connectionError) => {
				if (connectionError) {
					reject(connectionError)
				}
				this.connection.beginTransaction((transactionError) => {
					if (transactionError) {
						reject(transactionError)
					}
					resolve()
				})
			})
		})
	}
}