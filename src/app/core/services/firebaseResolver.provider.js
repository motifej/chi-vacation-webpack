export default function (app) {
    app.provider('firebaseResolver', FirebaseResolverProvider);

    function FirebaseResolverProvider () {
        this.loadUser = loadUser;
        this.$get = () => this;
    }

        function loadUser ($state, states, sailsService, sailsAuthService, $rootScope, actions) {
            "ngInject";
            let user = sailsAuthService.getAuthUser().user;
            const { USERLOADED } = actions;
            return sailsService.getUser({id: user.id}).then( e => {
                $rootScope.$emit(USERLOADED, e);
                return e;
            })
                    .catch( err =>
                        $state.go(states.ERRLOAD,{err: err}) );
        }

}