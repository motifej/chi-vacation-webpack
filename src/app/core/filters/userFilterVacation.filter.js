import { filter } from 'lodash';

export default function (app) {
    app.filter('userFilterVacation', userFilterVacation);

		function userFilterVacation() {
			return function(input, status) {
				if (input) {
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
							return item.endDate > new Date() && item.status == 'confirmed';
						});
						case 'spent':
						return filter(input, function(item) {
							return item.endDate < new Date() && item.status == 'confirmed';
						});
					}
				}
			};
		}
		
}