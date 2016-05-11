import { DAYSOFF, VACATIONS } from '../constants/vacations.consts';
import { SETTINGS_KEY } from '../constants/settings.consts';

export default class SailsService {
	constructor ($http, $resource, $rootScope, $parse, API_URL) {
		'ngInject';

		//http resources
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

		//http vacation create
		this['create' + VACATIONS] = (vacation) => this.http.post(API_URL + '/vacations/create2', vacation);
		this['create' + DAYSOFF] = (vacation) => this.http.post(API_URL + '/daysoff/create2', vacation);
		
		//http settings
		this.saveSettings = (settings) => {
			let { email, emailCreate, emailChanged } = settings;
			return this.http.put(API_URL + '/settings/' + SETTINGS_KEY, {
				email,
				emailCreate,
				emailChanged
			})
		}
		this.createSettings = () => this.http.post(API_URL + '/settings/create', { id:SETTINGS_KEY });
		this.getSettings = () => this.http.get(API_URL + '/settings/' + SETTINGS_KEY).catch(this.createSettings);

		//sockets
		this.socketInit = () => {

			io.socket.on('connect', () => {
      			console.log('*** Socket connected');
      			if (!io.socket.alreadyListeningToModels) {
    				io.socket.alreadyListeningToModels = true;
    				io.socket.on('users', socketUserActions.bind(this));
					io.socket.on('vacations', socketActions.bind(this, 'vacations'));
					io.socket.on('daysoff', socketActions.bind(this, 'daysoff'));	
    			}
      			io.socket.get(io.sails.url + '/users', null, this.updateData);
  			});

			function socketUserActions(obj) {
				let users = $parse('users')(this);
				if (obj.attribute || !users) return;
				let {data, id, verb} = obj;

				switch (verb) {
					case 'created': {
						$rootScope.$applyAsync(
							users.push(angular.extend(data, {vacations: [], daysoff: []}))
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
							if (this.user.id === data.uid) 
								this.user[params].push(data)
							if (this.users)
								_.find(this.users, {id: data.uid})[params].push(data); 
						});
						break;
					}

					case 'updated': {
						$rootScope.$applyAsync( () => {
							let user = _.find(this.users, {id: data.uid});
							angular.extend(_.find(user[params], {id}), data);
						});
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
					this.updateData(r);
					return this.users
				}
			)

		this.getUser = (id) => 
			this.userResource.getUserData(id).$promise.then(
				r => {
					this.user = r.data; 
					return this.user
				}
		)

		this.updateData = (r) => {
			if (!r) return;
      		if (!this.users)
      			this.users = [];
   			$rootScope.$applyAsync( () => {
				this.users.length = 0;
				this.users = angular.extend(this.users, r.data);	
			})
		}
		
	}
}