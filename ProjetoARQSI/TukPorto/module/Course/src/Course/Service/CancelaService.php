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
        return Json::decode(self::getRequest($url));
    }

    public static function getReadingsFromPoi($location)
    {
        $url = self::API_URL . self::API_SENSOR_VALUES_URL . $location;
        $body = self::getRequest($url);
        return Json::decode($body, true);
    }

    private static function getRequest($url)
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $client = new Client($url);
        $client->setMethod(Request::METHOD_GET);
        $bearer_token = 'Bearer ' . $_SESSION['access_token'];
        $client->setHeaders(array(
            'Authorization' => $bearer_token
        ));
        $client->setOptions([
            'sslverifypeer' => false
        ]);
        $response = $client->send();
        $body = $response->getBody();
        return $body;
    }
}

