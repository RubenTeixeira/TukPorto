<?php
namespace Course\Model;

class WayPoint
{
    
    public $waypoint_id;
    public $name;
    public $description;
    public $gps_lat;
    public $gps_long;
    public $course_id;
    
    public function exchangeArray($data)
    {
        $this->waypoint_id = (!empty($data['waypoint_id'])) ? $data['waypoint_id'] : null;
        $this->name = (!empty($data['name'])) ? $data['name'] : null;
        $this->description = (!empty($data['description'])) ? $data['description'] : null;
        $this->gps_lat = (!empty($data['gps_lat'])) ? $data['gps_lat'] : null;
        $this->gps_long = (!empty($data['gps_long'])) ? $data['gps_long'] : null;
        $this->course_id = (!empty($data['course_id'])) ? $data['course_id'] : null;
    }
    
    public function getArrayCopy()
    {
        return get_object_vars($this);
    }
    
    /**
     * Getters
     */
    
    public function getWayPointId()
    {
        return $this->waypoint_id;
    }
    
    public function getName()
    {
        return $this->name;
    }
    
    public function getDescription()
    {
        return $this->description;
    }
    
    public function getGpsLatitude()
    {
        return $this->gps_lat;
    }
    
    public function getGpsLongitude()
    {
        return $this->gps_long;
    }
    
    public function getCourseId()
    {
        return $this->course_id;
    }
    
    /**
     * Setters
     */
    
    public function setWayPointId($waypoint_id)
    {
        $this->waypoint_id = $waypoint_id;
    }
    
    public function setName($name)
    {
        $this->name = $name;
    }
    
    public function setDescription($description)
    {
        $this->description = $description;
    }
    
    public function setGpsLatitude($gps_lat)
    {
        $this->gps_lat = $gps_lat;
    }
    
    public function setGpsLongitude($gps_long)
    {
        $this->gps_long = $gps_long;
    }
    
    public function setCourseId($course_id)
    {
        $this->course_id = $course_id;
    }
}

