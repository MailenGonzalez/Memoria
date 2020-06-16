<?php
require_once 'api_base.php';
require_once '../model/config_model.php';

class DayApi extends ApiBase {
  private $model;

  function __construct($request){
    parent::__construct($request);
    $this->model = new ConfigModel();
  }

  function day(){
    switch ($this->method) {
      case 'GET':
        if(count($this->args)>0)
           return $this->model->getDays($this->args[0]);
         break;
      default:
            return 'Verbo no soportado';
        break;
    }
  }
}

?>
