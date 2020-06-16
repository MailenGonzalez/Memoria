<?php
require_once 'api_base.php';
require_once '../model/patient_model.php';

class PatientApi extends ApiBase {
  private $model;

  function __construct($request){
    parent::__construct($request);
    $this->model = new PatientModel();
  }

  function patient(){
    switch ($this->method) {
      case 'GET':
        if ($this->args[0] == 'PATIENTS')
          return $this->model->getPatients();
        if ($this->args[0] == 'NAME')
          return $this->model->getPatientsByName($this->args[1]);
        if ($this->args[0] == 'DATA')
          return $this->model->getPatientDataByID($this->args[1]);
        if ($this->args[0] == 'ENCRIPT')
          return $this->model->encrypt($this->args[1]);
        if ($this->args[0] == 'DELETE')
          return $this->model->deletePatient($this->args[1]);
         break;
      case 'PUT':
        return $this->model->putPatient($this->data);
        break;
      default:
            return 'Verbo no soportado';
        break;
    }
  }
}

?>
