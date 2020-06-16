<?php
   class PatientModel
   {
      private $db;

      public function __construct()
      {
         $this->engine = 'mysql';
         $this->host = 'sql10.freesqldatabase.com'; ///'mysql.hostinger.com.ar';//databases-auth.000webhost.com/
         $this->database = 'sql10347985';//'u782267423_rehab';//id13670518_paradigmamemoria
         $this->user = 'sql10347985';//'u782267423_rehab'; //id13670518_paradigmamemoria
         $this->pass = 'Hospital_Italiano2020';//'Sl3zqgJeQR'; // Hospital_Italiano2020
         $dns = $this->engine.':dbname='.$this->database.";host=".$this->host;
         $this->db = new PDO( $dns, $this->user, $this->pass ); 
      }

      /*function encrypt($string, $key) {
         $result = '';
         for($i=0; $i<strlen($string); $i++) {
            $char = substr($string, $i, 1);
            $keychar = substr($key, ($i % strlen($key))-1, 1);
            $char = chr(ord($char)+ord($keychar));
            $result.=$char;
         }
         return base64_encode($result);
      }*/

      //SELECT AES_ENCRYPT(IDPaciente,'hitaliano'), apellido, nombre, email  FROM `Pacientes` ORDER BY apellido,nombre DESC
      public function getPatients()
      {
         $query = $this->db->prepare("SELECT IDPaciente, apellido, nombre  FROM `Pacientes` WHERE activo = 1 ORDER BY apellido,nombre DESC");
         $query->execute();

         return $query->fetchAll();
      }

      public function getPatientsByName($data) 
      {
         $query = $this->db->prepare("SELECT IDPaciente, apellido, nombre  FROM `Pacientes` WHERE ((`apellido` REGEXP :data) or (`nombre` REGEXP :data)) and activo = 1 ORDER BY apellido,nombre DESC");
         
         $query->execute(array(':data' => $data));
         return $query->fetchAll();
      }

      public function encrypt($cadena){
         $key='HItaliano';  // Una clave de codificacion, debe usarse la misma para encriptar y desencriptar
         $encrypted = base64_encode($cadena . $key);//base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($key), $cadena, MCRYPT_MODE_CBC, md5(md5($key))));
         return $encrypted; //Devuelve el string encriptado
      }

      public function getPatientDataByID($IDPaciente) 
      {
         $query = $this->db->prepare("SELECT * FROM `Pacientes` WHERE `IDPaciente` = :IDPaciente ");

         $query->execute(array(':IDPaciente' => $IDPaciente));
         return $query->fetch();
      }

      public function putPatient($data) //Quizas conviene 2 funciones distintas
      {
         if ($data->IDPaciente == "") { 
            $query = $this->db->prepare("INSERT INTO `Pacientes`(`apellido`, `nombre`,`email`,`Terapeuta`,`FechaInicio`, `activo`) VALUES (:apellido,:nombre,:email,:terapeuta,:fechaInicio, 1)");

            $query->execute(array(':apellido' => $data->apellido,':nombre' => $data->nombre,':email' => $data->email,':terapeuta' => $data->terapeuta, ':fechaInicio' => $data->fechaInicio));
         }
         else {
            $query = $this->db->prepare("UPDATE `Pacientes` set `apellido` = :apellido, `nombre` = :nombre, `email`= :email, `terapeuta` = :terapeuta, `fechaInicio` = :fechaInicio  WHERE `IDPaciente` = :IDPaciente");

            $query->execute(array(':IDPaciente' => $data->IDPaciente,':apellido' => $data->apellido,':nombre' => $data->nombre,':email' => $data->email,':terapeuta' => $data->terapeuta, ':fechaInicio' => $data->fechaInicio));
         }
         return $query->fetch();
      }

      public function deletePatient($IDPaciente)  //proteger
      {   
         $query = $this->db->prepare("UPDATE `Pacientes` set `activo` = 0  WHERE `IDPaciente` = :IDPaciente");

         $query->execute(array(':IDPaciente' => $IDPaciente));
         return $query->fetch();
      }
   }
 ?>