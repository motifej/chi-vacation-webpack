import { filter } from 'lodash';

export default function (app) {
    app.filter('userFilterVacation', userFilterVacation);

		function userFilterVacation() {
			return function(input, status, date = 0) {
				if (input.length > 0) {
					if(date.startdate){
                        input = filter(input, item => (date.enddate) ? new Date(item.startdate) <= date.enddate && new Date(item.enddate) >= date.startdate : new Date(item.enddate) >= date.startdate);
                    }
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