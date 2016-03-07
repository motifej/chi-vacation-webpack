export default class AddNewUserController {
  constructor ($filter, $modalInstance, toastr, firebaseService) {
    'ngInject';

    this.invalidForm = false;
    this.namePattern = '[a-zA-Zа-яА-Я]+';
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.filter = $filter;
    this.firebaseService = firebaseService;
    this.toastr = toastr;
    this.modalInstance = $modalInstance;
    this.group = groups;
    this.role = users;

    this.newUser = {
      firstName: '',
      lastName: '',
      role: '',
      group: '',
      phone: '',
      email: '',
      password: '',
      vacations: {
        total: 0,
        dayOff: 0
      }
    }
  }

  submitForm (isValid) {
    if (isValid) {
      this.invalidForm = false;
      this.modalInstance.close();
      this.newUser.password = this.newUser.email;
      this.firebaseService.createUserByEmail(this.newUser).then(
        () => this.toastr.success('New user created', 'Success'),
        error => this.toastr.error(error.error.message, 'Error creating user')
        );
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

