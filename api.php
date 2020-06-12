<?php
require_once 'config_api.php';
require_once 'day_api.php';
require_once 'patient_api.php';
require_once 'result_api.php';
require_once 'memoria_api.php';
require_once 'dayMem_api.php';

switch (explode('/', rtrim($_GET['parametros'], '/'))[0]) {
	case 'config':
		$ConfigAPI = new ConfigAPI($_REQUEST['parametros']);
		echo $ConfigAPI->processAPI();
		break;
	case 'day':
		$DayAPI = new DayAPI($_REQUEST['parametros']);
		echo $DayAPI->processAPI();
		break;
	case 'patient':
		$PatientAPI = new PatientAPI($_REQUEST['parametros']);
		echo $PatientAPI->processAPI();
		break;
	case 'result':
		$ResultAPI = new ResultAPI($_REQUEST['parametros']);
		echo $ResultAPI->processAPI();
		break;
	case 'memoria':
		$MemoriaAPI = new MemoriaAPI($_REQUEST['parametros']);
		echo $MemoriaAPI->processAPI();
		break;
	case 'dayMem':
		$DayMemAPI = new DayMemAPI($_REQUEST['parametros']);
		echo $DayMemAPI->processAPI();
		break;
	default:
		# code...
		break;
}


?>