export default function (app) {
    app.provider('sailsResolver', SailsResolverProvider);

    function SailsResolverProvider () {
        this.loadUser = loadUser;
        this.$get = () => this;
    }

    function loadUser ($localStorage, $state, states, sailsService, sailsAuthService, $rootScope, actions) {
        "ngInject";
        let user = sailsAuthService.getAuthUser().user;
        return sailsService.getUser({id: user.id})
            .then( data => {
                $rootScope.$emit(actions.USERLOADED, data);
                return data;
            })
            .catch( err => {
                if (err.data.message === 'invalid token' || err.data.message === 'jwt expired') {
                    $localStorage.$reset();
                    $state.go(states.LOGIN, {err: err}); 
                } else
                $state.go(states.ERRLOAD, {err: err}) 
            }
        );
    }

}