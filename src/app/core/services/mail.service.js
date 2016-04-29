import { USERSTORAGEKEY } from '../constants/localstorage.consts';

export default class SailsAuthService {
	constructor ($localStorage, $http, API_URL) {
		'ngInject';
		this.$localStorage = $localStorage;
		this.$http = $http;
		this.authUser = $localStorage[ USERSTORAGEKEY ] || { status:false, data: false };

		this.baseUrl = API_URL;
	}

	sendMailResetPassword(data) {
		return this.$http.post(this.baseUrl + '/mail', data)
	}
	
}