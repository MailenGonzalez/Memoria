<?php
   class MemoriaModel
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

      public function getConfig($key)
      {
         $query = $this->db->prepare("SELECT * FROM configMemoria WHERE IDPaciente = :key AND fechaActivacion = (SELECT fechaActivacion FROM configMemoria WHERE fechaActivacion <= (NOW() - INTERVAL 3 HOUR) AND IDPaciente = :key ORDER BY fechaActivacion DESC LIMIT 1)");
         $query->execute(array(':key' => $key));
         return $query->fetchAll();
      }
	
	   public function getAllConfigs()
      {
         $query = $this->db->prepare("SELECT * FROM configMemoria WHERE fechaActivacion = (SELECT fechaActivacion FROM configMemoria WHERE fechaActivacion <= (NOW()- INTERVAL 3 HOUR) ORDER BY fechaActivacion DESC LIMIT 1)");
         $query->execute();
         //return $query->fetch();//creo que devuelve una sola col
         //que devuelva ordenado por date!!!
        
	  }
      private function decrypt($encrypted_id){
         $key='HItaliano';  // Una clave de codificacion, debe usarse la misma para encriptar y desencriptar
         $decrypted_id_raw = base64_decode($encrypted_id);
         $decrypted_id = preg_replace(sprintf('/%s/', $key), '', $decrypted_id_raw);
         
        //rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($key), base64_decode($cadena), MCRYPT_MODE_CBC, md5(md5($key))), "\0");
         return $decrypted_id;  //Devuelve el string desencriptado
      }

      public function getEncriptedConfig($encrypted_id)
      {
         $key='HItaliano';  // Una clave de codificacion, debe usarse la misma para encriptar y desencriptar
         $decrypted_id_raw = base64_decode($encrypted_id);
         $IDPaciente = preg_replace(sprintf('/%s/', $key), '', $decrypted_id_raw);
         
         $query = $this->db->prepare("SELECT * FROM configMemoria WHERE IDPaciente = :IDPaciente AND fechaActivacion = (SELECT fechaActivacion FROM configMemoria WHERE fechaActivacion <= (NOW()- INTERVAL 3 HOUR) AND IDPaciente = :IDPaciente ORDER BY fechaActivacion DESC LIMIT 1)");
         $query->execute(array(':IDPaciente' => $IDPaciente));
         return $query->fetchAll();
      }

      public function getDayConfig($IDPaciente, $fecha)
      {
         $query = $this->db->prepare("SELECT * FROM configMemoria WHERE IDPaciente = :IDPaciente AND fechaActivacion = (SELECT fechaActivacion FROM configMemoria WHERE fechaActivacion <= now() AND IDPaciente = :IDPaciente ORDER BY fechaActivacion DESC LIMIT 1) ");
         $query->execute(array(':IDPaciente' => $IDPaciente, ':fecha' => $fecha));
         return $query->fetchAll();
      }

     /* public function putConfig($key, $value)
      {
         $query = $this->db->prepare("SELECT COUNT(1) FROM ConfigRehabilitacionNeglet WHERE idPaciente = :key");
         $query->execute(array(':key' => $key));
         if($query->fetchColumn() > 0)
         {
            $query = $this->db->prepare("UPDATE ConfigRehabilitacionNeglet SET `Value` = :value  WHERE `Key` = :key");
         }
         else
         {
            $query = $this->db->prepare("INSERT INTO ConfigRehabilitacionNeglet VALUES (:key, :value)");
         }
         $query->execute(array(':key' => $key, ':value' =>$value));
         //$query->execute(array(':key' =>$key, ':value' =>$value, ':type' =>$type, ':description' =>$description));
         $query = $this->db->prepare("SELECT * FROM ConfigRehabilitacionNeglet WHERE `Key` = :key");

         return $query->fetch();
      }*/

     public function putAllConfigs($data)
      {
         /*foreach ($data as $valor)
            $this->putConfig($valor->Key, $valor->Value);*/
            /*agregar ejercicio y otras col!!!!!!!!!!!!!!*/
         $query = $this->db->prepare("REPLACE configMemoria VALUES (:IDPaciente, :fechaActivacion, :tiempoCodificacion, :tiempoRecuperacion, :tiempoJuego, :colorBackground, :colorLetras, :dificultadPal, :dificultadCuad)");

         $query->execute(array(':IDPaciente' => $data->IDPaciente, ':fechaActivacion' => $data->fechaActivacion, ':tiempoCodificacion' => $data->tiempoCodificacion, ':tiempoRecuperacion' => $data->tiempoRecuperacion, ':tiempoJuego' => $data->tiempoJuego, ':colorBackground' => $data->colorBackground, ':colorLetras' => $data->colorLetras, ':dificultadPal' => $data->dificultadPal, ':dificultadCuad' => $data->dificultadCuad));
         //$query->execute(array(':key' =>$key, ':value' =>$value, ':type' =>$type, ':description' =>$description));
         //$query = $this->db->prepare("SELECT * FROM ConfigRehabilitacionNeglet WHERE `IDPaciente` = :IDPaciente");

         //return $query->fetch();
        return "OK";
      }

	 /* public function putAllConfigs($data){
		
		$query = $this->db->prepare("INSERT INTO configMemoria VALUES (:IDPaciente, :tiempoCodificacion, :tiempoRecuperacion, :tiempoJuego, :colorBackground, :fechaActivacion, :colorLetras, :dificultad)");
		$query->execute(array(':IDPaciente' => $data->IDPaciente, ':tiempoCodificacion' => $data->tiempoCodificacion, ':tiempoRecuperacion' => $data->tiempoRecuperacion, ':tiempoJuego' => $data->tiempoJuego, ':colorBackground' => $data->colorBackground, ':fechaActivacion' => $data->fechaActivacion, ':colorLetras' => $data->colorLetras, ':dificultad' => $data->dificultad));
		return "OK";
	  }*/
	  
      public function getMemDays($key)
      {
         $query = $this->db->prepare("SELECT DISTINCT fechaActivacion as day FROM configMemoria WHERE IDPaciente = :key ORDER BY fechaActivacion ASC");

         $query->execute(array(':key' => $key));
         return $query->fetchAll();
      }
      
	  
	// Funciones de resultados
     /* public function saveResults($data)
      {
         $query = $this->db->prepare("INSERT INTO ResultadosNeglet VALUES (:IDPaciente, :fecha, :ejercicio, :fechaInicio, :cantItems, :cantClicks, :cantAciertos, :c1, :c2, :c3, :c4)");

         //$data = $data[0];
         $query->execute(array(':IDPaciente' => $data->IDPaciente, ':fecha' => $data->fecha, ':ejercicio' => $data->ejercicio, ':fechaInicio' => $data->fechaInicio, ':cantItems' => $data->cantItems, ':cantClicks' => $data->cantClicks, ':cantAciertos' => $data->cantAciertos, ':c1' => $data->c1, ':c2' => $data->c2, ':c3' => $data->c3, ':c4' => $data->c4));
         
         return true;
      }
      
      /*public function getCantPartidas($IDPaciente)
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
      }*/
   }
 ?>