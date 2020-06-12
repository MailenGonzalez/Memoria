<?php
require_once 'api_base.php';
require_once '../model/memoria_model.php';

class DayMemAPI extends ApiBase {
  private $model;

  function __construct($request){
    parent::__construct($request);
    $this->model = new MemoriaModel();
  }

  function dayMem(){
    switch ($this->method) {
      case 'GET':
        if(count($this->args)>0)
           return $this->model->getMemDays($this->args[0]);
         break;
      default:
            return 'Verbo no soportado';
        break;
    }
  }
}

?>
