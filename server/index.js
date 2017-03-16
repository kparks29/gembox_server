import express from 'express'
import bodyParser from 'body-parser'
import AuthController from './auth/authController'
import UserController from './user/userController'

let app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
	res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Token')
	if (req.method === 'OPTIONS') {
		res.sendStatus(200)
	} else {
		next()
	}
})

app.use('/auth', new AuthController().router)
app.use('/users', new UserController().router)

app.listen(process.env.PORT || 8001, () => {
	console.log(`Server listening on port ${process.env.PORT || 8001}`)
})

export default app