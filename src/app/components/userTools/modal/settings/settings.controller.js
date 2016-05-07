export default class SettingsController {
  constructor ($uibModalInstance, settings, toastr, sailsService) {
    'ngInject';

    this.invalidForm = false;
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.sailsService = sailsService;
    this.toastr = toastr;
    this.modalInstance = $uibModalInstance;

    this.settings = settings.data.data;
  }

  addEmail() {
    if (this.newEmail)
      if (~this.settings.email.indexOf(this.newEmail))
        this.toastr.error('Duplicate email');
      else {
        this.settings.email.push(this.newEmail); 
        this.newEmail = '';
      }
    else
      this.toastr.error('Incorrect email')
  }

  deleteEmail(email) {
    this.settings.email = this.settings.email.filter(
      el => el !== email
    );
  }

  submitForm (isValid) {
    this.sailsService.saveSettings(this.settings)
      .then(
        data => {
          this.toastr.success('Settings were saved');
          this.modalInstance.dismiss('cancel');
        },
        e => this.toastr.error(e.message, 'Error saving settings'))

  }

  cancel() {
    this.modalInstance.dismiss('cancel');
  }



}

