<?php
namespace Course\Service;

use Zend\Http\Client;
use Zend\Http\Request;
use Zend\Json\Json;

class CancelaService
{

    const API_URL = "https://localhost:44317";

    const API_LOGIN_URI = '/Token';

    const API_USERNAME = "editor@lugares.com";

    const API_PASSWORD = "password";

    const API_POI_URI = "/api/PointsOfInterest";
    // query string example: https://localhost:44317/api/sensores/SensorValues?sensorId=100&Local=[Lisboa]
    const API_SENSOR_VALUES_URL = '/api/sensores/SensorValues?sensorId=100&Local=';

    const API_LOCAL_URI = '/api/Locals/LocalByName?name=';

    const API_POI_SEARCH = self::API_POI_URI . '/POIByName?name=';

    public static function Login()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $client = new Client(self::API_URL . self::API_LOGIN_URI);
        $client->setMethod(Request::METHOD_POST);
        $params = 'grant_type=password&username=' . self::API_USERNAME . '&password=' . self::API_PASSWORD;
        $len = strlen($params);
        $client->setHeaders(array(
            'Content-Type' => 'application/x-www-form-urlencoded',
            'Content-Length' => $len
        ));
        $client->setOptions([
            'sslverifypeer' => false
        ]);
        $client->setRawBody($params);
        $response = $client->send();
        $body = Json::decode($response->getBody());
        if (! empty($body->access_token)) {
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }
            $_SESSION['access_token'] = $body->access_token;
            return true;
        } else
            return false;
    }

    public static function Logout()
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        
        $_SESSION['access_token'] = null;
    }

    public static function getPois()
    {
        $url = self::API_URL . self::API_POI_URI;
        return self::json_decode_nice(self::getRequest($url));
    }

    public static function getReadingsFromPoi($location)
    {
        $url = self::API_URL . self::API_SENSOR_VALUES_URL . urlencode($location);
        $body = self::getRequest($url);
        return self::json_decode_nice($body, true);
    }

    public static function getLocalByName($name)
    {
        $url = self::API_URL . self::API_LOCAL_URI . urlencode($name);
        $body = self::getRequest($url);
        return self::json_decode_nice($body, true);
    }

    public static function getPoiByName($name)
    {
        $url = self::API_URL . self::API_POI_SEARCH . urlencode($name);
        $body = self::getRequest($url);           
        return self::json_decode_nice($body);
    }

    private static function getRequest($url)
    {
        if (session_status() == PHP_SESSION_NONE || null === $_SESSION['access_token']) {
            self::Login();
        }
        $client = new Client($url);
        $client->setMethod(Request::METHOD_GET);
        $bearer_token = 'Bearer ' . $_SESSION['access_token'];
        $client->setHeaders(array(
            'Authorization' => $bearer_token,
        ));
        $client->setOptions([
            'sslverifypeer' => false
        ]);
        $response = $client->send();
        $body = $response->getBody();
        return $body;
    }

    private static function json_decode_nice($json, $assoc = FALSE)
    {
        // This will remove unwanted characters.
        // Check http://www.php.net/chr for details
        for ($i = 0; $i <= 31; ++$i) {
            $json = str_replace(chr($i), "", $json);
        }
        $json = str_replace(chr(127), "", $json);
        
        // This is the most common part
        // Some file begins with 'efbbbf' to mark the beginning of the file. (binary level)
        // here we detect it and we remove it, basically it's the first 3 characters
        if (0 === strpos(bin2hex($json), 'efbbbf')) {
            $json = substr($json, 3);
        }
        return json_decode($json, $assoc);
    }
}

