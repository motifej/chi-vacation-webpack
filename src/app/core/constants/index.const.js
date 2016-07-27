'use strict';
import * as actions from './actions.const';
import * as users  from './users.consts';
import { API_URL } from './api.consts';
import * as roles  from './roles.consts';
import * as states  from './routeStates.const';
import * as status from './status.consts';
import * as vacations from './vacations.consts';
import { groups } from './groups.consts';

export default function (app) {
    app
        .constant('actions', actions)
        .constant('users', users)
        .constant('API_URL', API_URL)
        .constant('roles', roles)
        .constant('states', states)
        .constant('status', status)
        .constant('vacations', vacations)
        .constant('groups', groups)
}
