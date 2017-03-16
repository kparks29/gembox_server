import Promise from 'promise'
import JsonWebToken from 'jsonwebtoken'

export default class Service {
	constructor () {

	}

	get promise () {
		return Promise
	}

	get jwt () {
		return JsonWebToken
	}

}
