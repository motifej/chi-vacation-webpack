export default class AddNewUserController {
  constructor ($filter, $parse, $uibModalInstance, toastr, users, groups, sailsService) {
    'ngInject';

    this.invalidForm = false;
    this.namePattern = '[a-zA-Zа-яА-Я\-]+';
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.filter = $filter;
    this.$parse = $parse;
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
  submitForm (form) {
    if (form.firstname.$invalid || form.lastname.$invalid) {
      this.toastr.error('Not able to save incorrect value. Allowed symbols: a-z, A-Z, а-я, А-Я', 'Error');
      this.invalidForm = true;
      return
    }
    if (form.email.$invalid) {
      this.toastr.error('Invalid email address format', 'Error');
      this.invalidForm = true;
      return
    }
    if (form.$valid) {
      this.invalidForm = false;
      this.newUser.employmentdate = this.employmentdate;
      this.newUser.password = this.newUser.email;
      this.sailsService.userResource.createUser(this.newUser).$promise
      .then(
        () => {
          this.toastr.success('User was created successfully', 'Success');
          this.modalInstance.close();
        },
        error => {
          this.toastr.error(this.$parse('data.data.raw.message')(error) || 'Not able to save incorrect value', 'Error');
        }
      )

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

