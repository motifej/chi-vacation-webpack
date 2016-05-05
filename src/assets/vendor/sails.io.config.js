import { API_URL } from '../../app/core/constants/api.consts';
import { USERSTORAGEKEY } from '../../app/core/constants/localstorage.consts';
require("script!./sails.io.js");

let storageData = JSON.parse(localStorage.getItem('ngStorage-' + USERSTORAGEKEY));

if (storageData && storageData.data && storageData.data.token)
	io.sails.headers = {
		"Authorization": "Bearer " + storageData.data.token
	}

io.sails.url = API_URL;
