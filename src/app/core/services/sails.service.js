import Firebase from 'firebase';
require("script!../../../assets/vendor/sails.io.js");

export default class SailsService {
	constructor ($http, $resource, $rootScope, $parse, API_URL) {
		'ngInject';
		io.sails.url = API_URL;
		this.http = $http;
		this.userResource = $resource(API_URL + "/users/:id", {id: "@id"}, {
			getUserData: {isArray: false, method: "GET"},
			updateUser: {isArray: false, method: "PUT"},
			createUser: {isArray: false, method: "POST"},
			deleteUser: {isArray: false, method: "DELETE"}
		});
		this.vacationsResource = $resource(API_URL + "/vacations/:id", {id: "@id"}, {
			get: {isArray: false, method: "GET"},
			update: {isArray: false, method: "PUT"},
			create: {isArray: false, method: "POST"},
			delete: {isArray: false, method: "DELETE"}
		});
		this.daysoffResource = $resource(API_URL + "/daysoff/:id", {id: "@id"}, {
			get: {isArray: false, method: "GET"},
			update: {isArray: false, method: "PUT"},
			create: {isArray: false, method: "POST"},
			delete: {isArray: false, method: "DELETE"}
		});

		
		


		this.socketInit = () => {

			io.socket.get(io.sails.url + '/users', null, (r) => {
				//this.users = r.data;
				io.socket.on('users', socketUserActions.bind(this));
				io.socket.on('vacations', socketActions.bind(this, 'vacations'));
				io.socket.on('daysoff', socketActions.bind(this, 'daysoff'));
			});

			function socketUserActions(obj) {
				let users = $parse('users.data')(this);
				if (obj.attribute || !users) return;
				let {data, id, verb} = obj;

				switch (verb) {
					case 'created': {
						$rootScope.$applyAsync(
							users.push(data)
						);
						break;
					}

					case 'updated': {
						$rootScope.$applyAsync(
							angular.extend(_.find(users, {id}), data)
						);
						break;	
					}

					case 'destroyed': {
						$rootScope.$applyAsync( () => {
							let copy = _.filter(users, 
								el => el.id !== id
							);
							users.length = 0;
							angular.extend(users, copy);
						});	
					}
				}

			};

			function socketActions(params, obj) {
				let {verb, data, id} = obj;

				switch (verb) {
					case 'created': {
						$rootScope.$applyAsync( () => {
							if (this.users)
								_.find(this.users.data, {id: data.uid})[params].push(data); 
							else
								if (this.user.id === data.uid) 
									this.user[params].push(data)
						});
						break;
					}

					case 'updated': {
						angular.extend(_.find(this.user[params], {id}), data);
						break;
					}

					case 'destroyed': {
						$rootScope.$applyAsync( () => {
							let copy = _.filter(this.user[params], 
								el => el.id !== id
							);
							this.user[params].length = 0;
							angular.extend(this.user[params], copy);
						});
					}
				}
				
			};
			
		};

		this.socketInit();

		this.getUsers = (id) => 
			this.userResource.getUserData(id).$promise.then(
				r => {
					this.users = r; 
					return r
				}
			)

		this.getUser = (id) => 
			this.userResource.getUserData(id).$promise.then(
				r => {
					this.user = r.data; 
					return r
				}
			)
			
	}
}