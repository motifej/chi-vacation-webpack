export default function (app) {
    app.provider('firebaseResolver', FirebaseResolverProvider);

    function FirebaseResolverProvider () {
        this.loadUser = loadUser;
        this.getUsersList = getUsersList;
        this.$get = () => this;
    }

        function loadUser (firebaseService, $state, states, sailsService, sailsAuthService, $rootScope, actions) {
            "ngInject";
            let user = sailsAuthService.getAuthUser().user;
            const { USERLOADED } = actions;
            return sailsService.userResource.getUserData({id: user.id}).$promise.then( e => {
                $rootScope.$emit(USERLOADED, e.data);
                return e;
            })
                    .catch( err =>
                        $state.go(states.ERRLOAD,{err: err}) );
            /*return firebaseService
                    .loadUser()
                    .catch( err =>
                        $state.go(states.ERRLOAD,{err: err}) );*/
        }

        function getUsersList(firebaseService) {
            'ngInject';
            debugger;
            return firebaseService.getUsersList();
        }

}