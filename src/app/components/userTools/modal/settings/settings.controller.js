export default class SettingsController {
  constructor ($filter, $uibModalInstance, settings, $uibModal, toastr, sailsService, groups, sailsAuthService, mailService) {
    'ngInject';

    this.invalidForm = false;
    this.namePattern = '[a-zA-Zа-яА-Я]+';
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.filter = $filter;
    this.sailsService = sailsService;
    this.mailService = mailService;
    this.sailsAuthService = sailsAuthService;
    this.toastr = toastr;
    this.modal = $uibModal;
    this.modalInstance = $uibModalInstance;

    this.settings = settings.data.data;
    console.log(this.settings);
  }

  addEmail() {
    this.sailsService.saveSettings([...this.settings.email, this.newEmail])
    .then(
      data => {
        this.settings.email.push(this.newEmail);
        this.newEmail = '';
        this.toastr.success('Email added')
      }
    ),
    e => this.toastr.error(e.message, 'Error adding email')

  }

  deleteEmail(email) {
    this.sailsService.saveSettings(this.settings.email.filter(
      el => el !== email
    ))
      .then(
        data => {
          this.settings.email = this.settings.email.filter(
            el => el !== email
          );
          this.toastr.success('Email deleted') 
        }
      ),
      e => this.toastr.error(e.message, 'Error deleting email')
  }

  submitForm (isValid) {
   /* if (isValid) {
      this.invalidForm = false;
      this.modalInstance.close();
      delete this.newUser.vacations;
      delete this.newUser.daysoff;
      this.updateUser({id: this.newUser.id}, this.newUser).$promise.then(
        () => this.toastr.success('Edit user success', 'Success'),
        error => this.toastr.error(error.data.message, 'Error updating user')
        );
    } else {
      this.toastr.error('Not all fields are filled', 'Error');
      this.invalidForm = true;
    }*/
  }

  cancel() {
    this.modalInstance.dismiss('cancel');
  }



}

