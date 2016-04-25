import Firebase from 'firebase';
require("script!../../../assets/vendor/sails.io.js");
io.sails.url = 'http://localhost:3000';

export default class SailsService {
	constructor ($http, $resource, $rootScope) {
		'ngInject';
		this.http = $http;
		this.userResource = $resource("http://localhost:3000/users/:id", {id: "@id"}, {
			getUserData: {isArray: false, method: "GET"},
			updateUser: {isArray: false, method: "PUT"},
			createUser: {isArray: false, method: "POST"},
			deleteUser: {isArray: false, method: "DELETE"}
		});
		this.vacationResource = $resource("http://localhost:3000/vacations/:id", {uid: "@uid", id: "@id"}, {
			postVacation: {isArray: false, method: "POST"},
			updateVacation: {isArray: false, method: "PUT"},
			createVacation: {isArray: false, method: "POST"},
			deleteVacation: {isArray: false, method: "DELETE"}
		});
		this.daysoffResource = $resource("http://localhost:3000/daysoff/:id", {uid: "@uid", id: "@id"}, {
			postDaysOff: {isArray: false, method: "POST"},
			updateDaysOff: {isArray: false, method: "PUT"},
			createDaysOff: {isArray: false, method: "POST"},
			deleteDaysOff: {isArray: false, method: "DELETE"}
		});

		


		this.socketInit = () => {

			io.socket.get(io.sails.url + '/users', null, (r) => {
				//this.users = r.data;
			});

			io.socket.on('users', (obj) => {
				if(obj.verb === 'created'){
					$rootScope.$applyAsync(
						this.users.data.push(obj.data)
					);
				}
				if (obj.verb === 'updated') {
					angular.extend(_.find(this.users.data, {id: obj.id}), obj.data);
				}
				if (obj.verb === 'destroyed') {
					$rootScope.$applyAsync( () => {
						let copy = _.filter(this.users.data, 
							el => el.id !== obj.id
						);
						this.users.data.length = 0;
						angular.extend(this.users.data, copy);
					});
				}
			});

			io.socket.on('vacations', (obj) => {
				if(obj.verb === 'created'){
					$rootScope.$applyAsync( () => {
						if (this.users && 'data' in this.users)
							_.find(this.users.data, {id: obj.data.uid}).vacations.push(obj.data); 
						else
						if (this.user.id === obj.data.uid) 
							this.user.vacations.push(obj.data)
					});
				}
				if (obj.verb === 'updated') {
					angular.extend(_.find(this.user.vacations, {id: obj.id}), obj.data);
				}
				if (obj.verb === 'destroyed') {
					$rootScope.$applyAsync( () => {
						let copy = _.filter(this.user.vacations, 
							el => el.id !== obj.id
						);
						this.user.vacations.length = 0;
						angular.extend(this.user.vacations, copy);
					});
				}
			});

			io.socket.on('daysoff', (obj) => {
				if(obj.verb === 'created'){
					$rootScope.$applyAsync( () => {
						if (this.users && 'data' in this.users)
							_.find(this.users.data, {id: obj.data.uid}).daysoff.push(obj.data);
						else 
						if (this.user.id === obj.data.uid) 
							this.user.daysoff.push(obj.data)
					});
				}
				if (obj.verb === 'updated') {
					angular.extend(_.find(this.user.daysoff, {id: obj.id}), obj.data);
				}
				if (obj.verb === 'destroyed') {
					$rootScope.$applyAsync( () => {
						let copy = _.filter(this.user.daysoff, 
							el => el.id !== obj.id
						);
						this.user.daysoff.length = 0;
						angular.extend(this.user.daysoff, copy);
					});
				}
			});


		};

		this.socketInit();

	this.setUsers = (data) => {
		this.users = data;
	}

	this.setUser = (data) => {
		this.user = data;
	}

	
	}


}