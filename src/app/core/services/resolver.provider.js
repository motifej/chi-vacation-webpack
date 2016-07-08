'use strict';

export default function (app) {
    app.provider('resolver', resolverProvider);

    function resolverProvider () {
       // this.asyncPagePrealoading = asyncPagePrealoading;
       this.loginPagePrealoading = loginPagePrealoading;
       this.adminPagePrealoading = adminPagePrealoading;
       this.managerPagePrealoading = managerPagePrealoading;
        this.$get = () => this;
    }

    function loginPagePrealoading ($q, $ocLazyLoad) {
        "ngInject";

        var deferred = $q.defer();
        require.ensure([], function (require) {
            var asyncModule = require('../../pages/login/login.module');
            $ocLazyLoad.load({
                name: asyncModule.name,
            });
            deferred.resolve(asyncModule.controller);
        });
        return deferred.promise;
    }

    function adminPagePrealoading ($q, $ocLazyLoad) {
        "ngInject";

        var deferred = $q.defer();
        require.ensure([], function (require) {
            var asyncModule = require('../../pages/admin/admin.module');
            $ocLazyLoad.load({
                name: asyncModule.name,
            });
            deferred.resolve(asyncModule.controller);
        });
        return deferred.promise;
    }

    function managerPagePrealoading ($q, $ocLazyLoad) {
        "ngInject";

        var deferred = $q.defer();
        require.ensure([], function (require) {
            var asyncModule = require('../../pages/manager/manager.module');
            $ocLazyLoad.load({
                name: asyncModule.name,
            });
            deferred.resolve(asyncModule.controller);
        });
        return deferred.promise;
    }

}
