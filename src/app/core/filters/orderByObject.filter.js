export default function (app) {
    app.filter('orderByObject', orderByObject);

    function orderByObject() {
        return function(items, field) {
            let reverse = false;
            let order = field;
            if (order[0] === '-') {
                reverse = true;
                order = order.slice(1); 
            }
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[order] > b[order] ? 1 : -1);
            });
            if (reverse) filtered.reverse();
            return filtered;
        }
    }
}
