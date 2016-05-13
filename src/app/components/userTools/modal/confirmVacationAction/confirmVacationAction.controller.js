export default class ConfirmVacationAction {
  constructor ($uibModalInstance, $uibModal) {
    'ngInject';

    this.modal = $uibModal;
    this.modalInstance = $uibModalInstance;
    
  }

  ok() {
    this.modalInstance.close(true);
  };

  cancel() {
    this.modalInstance.dismiss();
  }; 

}