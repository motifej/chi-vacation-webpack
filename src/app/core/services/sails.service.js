import { DAYSOFF, VACATIONS, WORKFROMHOME } from '../constants/vacations.consts';
import { SETTINGS_KEY } from '../constants/settings.consts';

export default class SailsService {
	constructor ($http, $resource, $rootScope, $parse, API_URL) {
		'ngInject';

		//http resources
						this.vacationsTransformatedData = {
					      vacations: [],
					      daysoff: [],
					      workfromhome: []
					    }
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
		this.workfromhomeResource = $resource(API_URL + "/workfromhome/:id", {id: "@id"}, {
			get: {isArray: false, method: "GET"},
			update: {isArray: false, method: "PUT"},
			create: {isArray: false, method: "POST"},
			delete: {isArray: false, method: "DELETE"}
		});		

		//http vacation create
		this['create' + VACATIONS] = (vacation) => this.http.post(API_URL + '/vacations/create2', vacation);
		this['create' + DAYSOFF] = (vacation) => this.http.post(API_URL + '/daysoff/create2', vacation);
		this['create' + WORKFROMHOME] = (vacation) => this.http.post(API_URL + '/workfromhome/create2', vacation);
		
		//http settings
		this.saveSettings = (settings) => this.http.put(API_URL + '/settings/' + SETTINGS_KEY, settings);
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
					io.socket.on('workfromhome', socketActions.bind(this, 'workfromhome'));	
    			}
      			io.socket.get(io.sails.url + '/users', null, this.updateData);
  			});

			function socketUserActions(obj) {
				console.log('socket user data received', obj);
				let users = $parse('users')(this);
				if (obj.attribute || !users) return;
				let {data, id, verb} = obj;

				switch (verb) {
					case 'created': {
						console.log('user created', obj);
						$rootScope.$applyAsync(
							users.push(angular.extend(data, {vacations: [], daysoff: []}))
						);
						break;
					}

					case 'updated': {
						console.log('user updated', obj);
						$rootScope.$applyAsync(
							angular.extend(_.find(users, {id}) || {}, data)
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
				console.log('socket vacation data received', obj);
				let {verb, data, id} = obj;

				switch (verb) {
					case 'created': {
						console.log('vacation created', obj);
						$rootScope.$applyAsync( () => {
							if (this.user.id === data.uid) 
								if (!_.find(this.user[params], {id: data.id}))
									this.user[params].push(data)
							if (this.users) {
								let u = _.find(this.users, {id: data.uid});
								if (!_.find(u[params], {id: data.id}))
									u[params].push(data); 
							}
						});
						break;
					}

					case 'updated': {
						console.log('vacation updated', obj);
						$rootScope.$applyAsync( () => {
							let user = _.find(this.users, {id: data.uid});
							angular.extend(_.find(user[params], {id}) || {}, data);
							angular.extend(_.find(this.user[params], {id}) || {}, data);
						});
						console.log('vacation updated, new status:', this.users);
						break;
					}

					case 'destroyed': {
						console.log('vacation deleted', obj);
						$rootScope.$applyAsync( () => {
							let copy = _.filter(this.user[params], 
								el => el.id !== id
							);
							this.user[params].length = 0;
							angular.extend(this.user[params], copy);
							
							if (this.users) {
								let user = _.find(this.users, {id: obj.previous.uid.id});
								user[params].length = 0;
								angular.extend(user[params], copy);
							}
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

		this.getVacations = (id) => 
			this.userResource.getUserData(id).$promise.then(
				r => {
      		console.log("1", r.data);
					this.updateData(r);
					return this.vacationsTransformatedData
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
      		this.vacationsTransformatedData = {
		      vacations: [],
		      daysoff: [],
		      workfromhome: []
		    }
      		console.log("2", r.data);
   			$rootScope.$applyAsync( () => {
				this.users.length = 0;
				this.users = angular.extend(this.users, r.data);
				    this.users.forEach(user => {
				        user.vacations.forEach(vacation => {
				        	vacation = angular.copy(vacation);
				        	vacation.user = user;
				        	vacation.deleted = user.deleted;
				        	this.vacationsTransformatedData.vacations.push(vacation);
				        });
				        user.daysoff.forEach(dayoff => {
				        	dayoff = angular.copy(dayoff);
				        	dayoff.user = user;
				        	dayoff.deleted = user.deleted;
				        	this.vacationsTransformatedData.daysoff.push(dayoff);
				        });
				        user.workfromhome.forEach(workfromhome => {
				        	workfromhome = angular.copy(workfromhome);
				        	workfromhome.user = user;
				        	workfromhome.deleted = user.deleted;
				        	this.vacationsTransformatedData.workfromhome.push(workfromhome);
				        });
				    });	
			})
		}
		
	}
}