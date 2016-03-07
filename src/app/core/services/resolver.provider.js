'use strict';

export default function (app) {
    app.provider('resolver', resolverProvider);

    function resolverProvider () {
        this.asyncPagePrealoading = asyncPagePrealoading;
        this.$get = () => this;
    }

        function asyncPagePrealoading(name) {
            return ($q, $ocLazyLoad) => {
                "ngInject";
                var deferred = $q.defer();
                require.ensure([], function (require) {
                    var asyncModule = require(`../../pages/${name}/${name}.module`);
                    $ocLazyLoad.load({
                        name: asyncModule.name,
                    });
                    deferred.resolve(asyncModule.controller);
                });
                return deferred.promise;
            }
        }

}
