import { filter } from 'lodash';

export default function (app) {
    app.filter('userFilterVacation', userFilterVacation);

		function userFilterVacation() {
			return function(input, status, date = 0) {
				if (input.length > 0) {
					if(date.startdate){
			            input = filter(input, item => (date.enddate) ? 
			            new Date(item.startdate) <= date.enddate && 
			            new Date(item.enddate) >= date.startdate : 
			            new Date(item.enddate) >= date.startdate);
			        }
			        var filteredInput = [];
					
						if(status.new) {
							filteredInput = [...filteredInput, ...filter(input, function(item) {
								return item.status == 'new';
							})]
						}
						if(status.rejected) {
							filteredInput = [...filteredInput, ...filter(input, function(item) {
								return item.status == 'rejected';
							})]
						}
						if(status.confirmed) {
							filteredInput = [...filteredInput, ...filter(input, function(item) {
								return new Date(item.startdate) > 
								new Date() && item.status == 'confirmed';
							})]
						}
						if(status.inprogress) {
							filteredInput = [...filteredInput, ...filter(input, function(item) {
								return new Date(item.startdate) < new Date() && 
								new Date(new Date(item.enddate).setDate(new Date(item.enddate).getDate() + 1)) > 
								new Date() && item.status == 'confirmed';
							})]
						}
						if(status.spent) {
							filteredInput = [...filteredInput, ...filter(input, function(item) {
								return new Date(new Date(item.enddate).setDate(new Date(item.enddate).getDate() + 1)) < 
								new Date() && item.status == 'confirmed';
							})]
						}
						/*default:
							return input;*/
					return filteredInput;
				}
			};
		}
		
}