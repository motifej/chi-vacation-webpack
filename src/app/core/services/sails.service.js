import Firebase from 'firebase';

export default class SailsService {
	constructor ($http, $resource) {
		'ngInject';
		this.http = $http;
		this.userResource = $resource("http://localhost:3000/v1/users?uid=:id", {id: "@id"}, {
			getUserData: {isArray: false, method: "GET"}
		})
	}

}