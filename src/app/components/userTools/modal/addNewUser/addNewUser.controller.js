export default class AddNewUserController {
  constructor ($filter, $uibModalInstance, toastr, firebaseService, users, groups, sailsService) {
    'ngInject';

    this.invalidForm = false;
    this.namePattern = '[a-zA-Zа-яА-Я]+';
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.filter = $filter;
    this.firebaseService = firebaseService;
    this.sailsService = sailsService;
    this.toastr = toastr;
    this.modalInstance = $uibModalInstance;
    this.group = groups;
    this.role = users;
    this.employmentdate = new Date();

    this.newUser = {
      firstname: '',
      lastname: '',
      employmentdate: 0,
      role: '',
      group: '',
      phone: '',
      email: '',
      password: '',
      added: [0]
    }
  }
  top1(){
    console.log(this.newUser.employmentDate);
  }
  submitForm (isValid) {
    if (isValid) {
      this.invalidForm = false;
      this.modalInstance.close();
      this.newUser.employmentdate = this.employmentdate;
      this.newUser.password = this.newUser.email;
      /*this.firebaseService.createUserByEmail(this.newUser).then(
        () => this.toastr.success('New user created', 'Success'),
        error => this.toastr.error(error.error.message, 'Error creating user')
        );*/
      this.sailsService.userResource.createUser(this.newUser);
    } else {
      this.toastr.error('Not all fields are filled', 'Error');
      this.invalidForm = true;
    }
  }

  phoneChanged() {
   this.newUser.phone = this.filter('phoneFilter')(this.newUser.phone);
  }

  cancelNewUser() {
    this.modalInstance.dismiss('cancel');
  }

}

