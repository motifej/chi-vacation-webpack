export default class SettingsController {
  constructor ($uibModalInstance, settings, toastr, sailsService, groups) {
    'ngInject';

    this.invalidForm = false;
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.sailsService = sailsService;
    this.toastr = toastr;
    this.modalInstance = $uibModalInstance;

    this.settings = settings.data.data;
    if (!this.settings.groups) 
      this.settings.groups = [];
    this.settings.groups = _.unionWith(this.settings.groups, groups.map( el => ({emails: [], name: el})), (el,vl) => el.name == vl.name);
    this.groups = this.settings.groups;
    //debugger
    
    //let copyGroups = angular.copy(this.groups);
    //this.groups.length = 0;

    this.group = this.groups[0];

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

  addGroupEmail() {
    if (this.newGroupEmail) {
      let obj = _.find(this.groups, {
        name: this.group.name
      });
      if (obj && !~obj.emails.indexOf(this.newGroupEmail)) {
          obj.emails.push(this.newGroupEmail);
          this.newGroupEmail = '';
      } else {
          this.toastr.error('Duplicate email');
        }
    }
    else
      this.toastr.error('Incorrect email')
    console.log(this.settings);
  }

  deleteGroupEmail(email) {
    let obj = _.find(this.groups, {
        name: this.group.name
    });
    obj.emails = obj.emails.filter(
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

