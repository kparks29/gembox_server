import Migration from '../../models/migrationModel'

const QUERIES = [
	`CREATE TABLE IF NOT EXISTS users (
		id SERIAL,
		uuid VARCHAR(36) UNIQUE,
		firstName VARCHAR(255),
		lastName VARCHAR(255),
		email VARCHAR(255) NOT NULL UNIQUE,
		phone VARCHAR(255),
		salt VARCHAR(255) NOT NULL,
		hashedPassword BINARY(60) NOT NULL,
		createdOn DATETIME DEFAULT NOW(),
		PRIMARY KEY (id)
	);`,
	`CREATE TRIGGER before_insert_user
		BEFORE INSERT ON users
		FOR EACH ROW
		SET new.uuid = UUID();`
]

let migration = new Migration(QUERIES)
export default migration
