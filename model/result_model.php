<?php
   class ResultModel
   {
      private $db;

      public function __construct()
      {
         $this->engine = 'mysql';
         $this->host = 'mysql.hostinger.com.ar';
         $this->database = 'u782267423_rehab';
         $this->user = 'u782267423_rehab';
         $this->pass = 'Sl3zqgJeQR';
         $dns = $this->engine.':dbname='.$this->database.";host=".$this->host;
         $this->db = new PDO( $dns, $this->user, $this->pass ); 
      }

      public function saveResults($data)
      {
         $query = $this->db->prepare("INSERT INTO ResultadosNeglet VALUES (:IDPaciente, :fecha, :ejercicio, :fechaInicio, :cantItems, :cantClicks, :cantAciertos, :c1, :c2, :c3, :c4)");

         //$data = $data[0];
         $query->execute(array(':IDPaciente' => $data->IDPaciente, ':fecha' => $data->fecha, ':ejercicio' => $data->ejercicio, ':fechaInicio' => $data->fechaInicio, ':cantItems' => $data->cantItems, ':cantClicks' => $data->cantClicks, ':cantAciertos' => $data->cantAciertos, ':c1' => $data->c1, ':c2' => $data->c2, ':c3' => $data->c3, ':c4' => $data->c4));
         
         return true;
      }
      
      public function getCantPartidas($IDPaciente)
      {
         $query = $this->db->prepare("SELECT EXTRACT(YEAR FROM `fechaInicio`) as Year,EXTRACT(MONTH FROM `fechaInicio`) as Month, count(*) as cant FROM (SELECT `fechaInicio` FROM `ResultadosNeglet` GROUP BY `fechaInicio`,`IDPaciente` HAVING `IDPaciente` = :IDPaciente) AS T1 GROUP BY EXTRACT(YEAR_MONTH FROM `fechaInicio`);");

         $query->execute(array(':IDPaciente' => $IDPaciente));
         return $query->fetchAll();
      }

      public function getDatesOfResults($IDPaciente)
      {
         $query = $this->db->prepare("SELECT DISTINCT left(`fechaInicio`, 10) as day FROM `ResultadosNeglet` WHERE `IDPaciente` = :IDPaciente group by `fechaInicio` ORDER BY `fechaInicio` ASC;");

         $query->execute(array(':IDPaciente' => $IDPaciente));
         return $query->fetchAll();
      }

      public function getResults($IDPaciente, $fechaInicio)
      { 
         $query = $this->db->prepare("SELECT * FROM `ResultadosNeglet` WHERE `IDPaciente` = :IDPaciente AND left(`fechaInicio`, 10) = :fechaInicio ORDER BY `fecha` ASC");

         $query->execute(array(':IDPaciente' => $IDPaciente, ':fechaInicio' => $fechaInicio));
         return $query->fetchAll();
      }

      public function getAllResults($IDPaciente)
      { 
         $query = $this->db->prepare("SELECT * FROM `ResultadosNeglet` WHERE `IDPaciente` = :IDPaciente ORDER BY `fecha` ASC");

         $query->execute(array(':IDPaciente' => $IDPaciente));
         return $query->fetchAll();
      }

      public function getSummaryResults($IDPaciente, $fechaInicio, $fechaFin)
      { 
         $query = $this->db->prepare("SELECT SUM(cantItems) AS cantItems, SUM(cantClicks) AS cantClicks, SUM(cantAciertos) AS aciertos, (SUM(cantClicks) - SUM(cantAciertos)) AS errores, SUM(c1) AS c1, SUM(c2) AS c2, SUM(c3) AS c3, SUM(c4) AS c4, ejercicio FROM `ResultadosNeglet` WHERE fecha BETWEEN :fechaInicio AND :fechaFin AND `IDPaciente` = :IDPaciente GROUP BY `ejercicio`");

         $query->execute(array(':IDPaciente' => $IDPaciente, ':fechaInicio' => $fechaInicio, ':fechaFin' => $fechaFin));
         return $query->fetchAll();
      }
   }
 ?>