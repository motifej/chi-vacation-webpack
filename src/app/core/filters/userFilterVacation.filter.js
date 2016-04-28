import { filter } from 'lodash';

export default function (app) {
    app.filter('userFilterVacation', userFilterVacation);

		function userFilterVacation() {
			return function(input, status) {
				if (input.length > 0) {
					switch (status) {
						case 'new':
						return filter(input, function(item) {
							return item.status == 'new';
						});
						case 'rejected':
						return filter(input, function(item) {
							return item.status == 'rejected';
						});
						case 'confirmed':
						return filter(input, function(item) {
							return new Date(item.startdate) > new Date() && item.status == 'confirmed';
						});
						case 'inprogress':
						return filter(input, function(item) {
							return new Date(item.startdate) < new Date() && new Date(item.enddate) > new Date() && item.status == 'confirmed';
						});
						case 'spent':
						return filter(input, function(item) {
							return new Date(item.enddate) < new Date() && item.status == 'confirmed';
						});
						default:
							return input;
					}
				}
			};
		}
		
}