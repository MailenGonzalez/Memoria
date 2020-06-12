<?php
require_once 'api_base.php';
require_once '../model/result_model.php';

class ResultApi extends ApiBase {
  private $model;

  function __construct($request){
    parent::__construct($request);
    $this->model = new ResultModel();
  }

  function result(){
    switch ($this->method) {
      case 'GET':
        if ($this->args[0] == 'CANTPARTIDAS')
          return $this->model->getCantPartidas($this->args[1]);
        if ($this->args[0] == 'DATES')
          return $this->model->getDatesOfResults($this->args[1]);
        if ($this->args[0] == 'RESULTS')
          return $this->model->getResults($this->args[1],$this->args[2]);
        if ($this->args[0] == 'ALLRESULTS')
          return $this->model->getAllResults($this->args[1]);
        if ($this->args[0] == 'SUMMARY')
          return $this->model->getSummaryResults($this->args[1],$this->args[2],$this->args[3]);
      break;
      case 'PUT':
        return $this->model->saveResults($this->data);
        break;
      default:
        return "Verbo no soportado";
        break;
    }
  }
}

?>
