<?php
   class ConfigModel
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

      public function getAllConfigs()
      {
         $query = $this->db->prepare("SELECT * FROM `ConfigRehabilitacionNeglet` WHERE IDPaciente = :key AND fechaActivacion = (SELECT fechaActivacion FROM `ConfigRehabilitacionNeglet` WHERE fechaActivacion <= (NOW()- INTERVAL 3 HOUR) AND IDPaciente = 36608126 ORDER BY fechaActivacion DESC LIMIT 1) order by ejercicio ASC");
         $query->execute();
         //return $query->fetch();//creo que devuelve una sola col
         //que devuelva ordenado por date!!!
         return $query->fetchAll();
      }

      public function getConfig($key)
      {
         $query = $this->db->prepare("SELECT * FROM `ConfigRehabilitacionNeglet` WHERE IDPaciente = :key AND fechaActivacion = (SELECT fechaActivacion FROM `ConfigRehabilitacionNeglet` WHERE fechaActivacion <= (NOW()- INTERVAL 3 HOUR) AND IDPaciente = :key ORDER BY fechaActivacion DESC LIMIT 1) order by ejercicio ASC");
         $query->execute(array(':key' => $key));
         return $query->fetchAll();
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
         
         $query = $this->db->prepare("SELECT * FROM `ConfigRehabilitacionNeglet` WHERE IDPaciente = :IDPaciente AND fechaActivacion = (SELECT fechaActivacion FROM `ConfigRehabilitacionNeglet` WHERE fechaActivacion <= (NOW()- INTERVAL 3 HOUR) AND IDPaciente = :IDPaciente ORDER BY fechaActivacion DESC LIMIT 1) order by ejercicio ASC");
         $query->execute(array(':IDPaciente' => $IDPaciente));
         return $query->fetchAll();
      }

      public function getDayConfig($IDPaciente, $fecha)
      {
         $query = $this->db->prepare("SELECT * FROM `ConfigRehabilitacionNeglet` WHERE IDPaciente = :IDPaciente AND fechaActivacion = (SELECT fechaActivacion FROM `ConfigRehabilitacionNeglet` WHERE fechaActivacion <= :fecha AND IDPaciente = :IDPaciente ORDER BY fechaActivacion DESC LIMIT 1) order by fechaEmision DESC,ejercicio ASC");
         $query->execute(array(':IDPaciente' => $IDPaciente, ':fecha' => $fecha));
         return $query->fetchAll();
      }

      public function putConfig($key, $value)
      {
         $query = $this->db->prepare("SELECT COUNT(1) FROM ConfigRehabilitacionNeglet WHERE `Key` = :key");
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
      }

      public function putAllConfigs($data)
      {
         /*foreach ($data as $valor)
            $this->putConfig($valor->Key, $valor->Value);*/
            /*agregar ejercicio y otras col!!!!!!!!!!!!!!*/
         $query = $this->db->prepare("REPLACE ConfigRehabilitacionNeglet VALUES (:IDPaciente, :fechaActivacion, :ejercicio, :fechaEmision, :transparenciaCuadrante, :tipoFigura, :tamanioTarget, :backgroundColor, :tiempoExposicion, :tiempoAparicion, :velocidadTrayectoriaTarget, :cantElementosDistractores, :tamanioElementosDistractores, :velocidadTrayectoriaElementosDistractores, :cantRepeticionFrase, :delayFrase, :controlInhibitorioMotor, :tiempoEjercicio)");

         $query->execute(array(':IDPaciente' => $data->IDPaciente, ':fechaActivacion' => $data->fechaActivacion, ':ejercicio' => $data->ejercicio, ':fechaEmision' => $data->fechaEmision, ':transparenciaCuadrante' => $data->transparenciaCuadrante, ':tipoFigura' => $data->tipoFigura, ':tamanioTarget' => $data->tamanioTarget, ':backgroundColor' => $data->backgroundColor, ':tiempoExposicion' => $data->tiempoExposicion, ':tiempoAparicion' => $data->tiempoAparicion, ':velocidadTrayectoriaTarget' => $data->velocidadTrayectoriaTarget, ':cantElementosDistractores' => $data->cantElementosDistractores, ':tamanioElementosDistractores' => $data->tamanioElementosDistractores, ':velocidadTrayectoriaElementosDistractores' => $data->velocidadTrayectoriaElementosDistractores, ':cantRepeticionFrase' => $data->cantRepeticionFrase, ':delayFrase' => $data->delayFrase,':controlInhibitorioMotor' => $data->controlInhibitorioMotor, ':tiempoEjercicio' => $data->tiempoEjercicio));
         //$query->execute(array(':key' =>$key, ':value' =>$value, ':type' =>$type, ':description' =>$description));
         //$query = $this->db->prepare("SELECT * FROM ConfigRehabilitacionNeglet WHERE `IDPaciente` = :IDPaciente");

         //return $query->fetch();
         return "OK";
      }

      public function getDays($key)
      {
         $query = $this->db->prepare("SELECT DISTINCT fechaActivacion as day FROM `ConfigRehabilitacionNeglet` WHERE IDPaciente = :key ORDER BY fechaActivacion ASC");

         $query->execute(array(':key' => $key));
         return $query->fetchAll();
      }
      
   }
 ?>