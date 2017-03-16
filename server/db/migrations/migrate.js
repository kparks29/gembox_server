import config from '../../../package.json'
import fs from 'fs'

function executeQuery (count) {
	if (count >= config.maxMigration) {
		config.currentMigration = config.maxMigration
		fs.writeFileSync('./package.json', JSON.stringify(config, null, 2))
		process.exit()
	} else {
		let migration = require(`${__dirname}/migration-${count + 1}.js`).default
		migration.then(() => {
			config.currentMigration++
			console.log(`Migration ${config.currentMigration} Successful`)
			executeQuery(config.currentMigration)
		}).catch((err) => {
			console.log(err)
			process.exit(1)
		})
	}
}

if (config.currentMigration === config.maxMigration) {
	console.log('Migrations Not Run, Database up to date.')
} else {
	executeQuery(config.currentMigration)
}
