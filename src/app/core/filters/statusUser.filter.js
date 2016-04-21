export default function (app) {
    app.filter('statusUserFilter', statusUserFilter);

    function statusUserFilter() {
        return function(input, filterKey, filterVal, list) {
            var filteredInput = {};
            angular.forEach(input, function(value, key) {
                var vacationsList = value[list];
                angular.forEach(vacationsList, function(item) {
                   if ((item[filterKey] && item[filterKey] == filterVal)||!filterVal) {
                    filteredInput[key] = value;
                } 
                })
                
            });
            return filteredInput;
        }
    }    

}