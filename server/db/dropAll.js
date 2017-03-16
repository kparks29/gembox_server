import Migration from '../models/migrationModel'
import config from '../../package.json'
import fs from 'fs'

const QUERIES = [
	'SET FOREIGN_KEY_CHECKS=0',
	'DROP TABLE IF EXISTS users',
	'SET FOREIGN_KEY_CHECKS=1'
]

let migration = new Migration(QUERIES)

migration.then(() => {
	config.currentMigration = 0
	fs.writeFileSync('./package.json', JSON.stringify(config, null, 2))
	console.log('DONE')
	process.exit()
}).catch((err) => {
	console.log(err)
	process.exit()
})
