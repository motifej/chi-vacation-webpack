import Firebase from 'firebase';

export default class SailsService {
	constructor ($http, $resource) {
		'ngInject';
		this.http = $http;
		this.userResource = $resource("http://localhost:3000/users", {id: "@id"}, {
			getUserData: {isArray: false, method: "GET"}
		});
		this.vacationRequest = $resource("http://localhost:3000/v1/vacations", {}, {
			postVacation: {isArray: false, method: "POST"}
		});
		this.daysOffRequest = $resource("http://localhost:3000/v1/daysoffs", {}, {
			postDaysOff: {isArray: false, method: "POST"}
		});
	}

}