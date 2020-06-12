<?php
require_once 'api_base.php';
require_once '../model/memoria_model.php';

class MemoriaAPI extends ApiBase {
  private $model;

  function __construct($request){
    parent::__construct($request);
    $this->model = new MemoriaModel();
  }

  function memoria(){
    switch ($this->method) {
      case 'GET':
        if(count($this->args)>0){
          if(count($this->args)==1)
            return $this->model->getConfig($this->args[0]);
          if ($this->args[0] == 'DAY')
            return $this->model->getDayConfig($this->args[1], $this->args[2]);
		  if ($this->args[0] == 'ENCRIPTED')
            return $this->model->getEncriptedConfig($this->args[1]);
        }
        else
           return $this->model->getAllConfigs();//ver si lo uso
        break;
        //getEncriptedConfig
      case 'DELETE':
        break;
      case 'PUT': 
           return $this->model->putAllConfigs($this->data);
        break;
      default:
            return 'Verbo no soportado';
        break;
    }
  }
}

?>
