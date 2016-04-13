export default class UserInfoController {
  constructor (user, $uibModal) {
    'ngInject';
    this.user = user;
    this.modal = $uibModal;
    
    }
    editUser(user) {
    	this.modal.open({
        templateUrl: require('!!file!../editUser/editForm.html'),
        controller: require('../editUser/editUser.controller'),
        controllerAs: 'user',
        resolve: {
        	user: user
        }
      });
    }
  }