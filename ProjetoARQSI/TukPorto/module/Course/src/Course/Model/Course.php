<?php
namespace Course\Model;

class Course
{
    
    public $course_id;
    public $description;
    public $date;
    public $user_id;
    
    public function exchangeArray($data)
    {
        $this->course_id = (!empty($data['course_id'])) ? $data['course_id'] : null;
        $this->description = (!empty($data['description'])) ? $data['description'] : null;
        $this->date = (!empty($data['date'])) ? $data['date'] : null;
        $this->user_id = (!empty($data['user_id'])) ? $data['user_id'] : null;
    }
    
    public function getArrayCopy()
    {
        return get_object_vars($this);
    }
    
    /**
     * Getters
     */
    
    public function getCourseId()
    {
        return $this->course_id;
    }
    
    public function getDescription()
    {
        return $this->description;
    }
    
    public function getDate()
    {
        return $this->date;
    }
    
    public function getUserId()
    {
        return $this->user_id;
    }
    
    /**
     * Setters
     */
    
    public function setCourseId($course_id)
    {
        $this->course_id = $course_id;
    }
    
    public function setDescription($description)
    {
        $this->description = $description;
    }
    
    public function setDate($date)
    {
        $this->date = $date;
    }
    
    public function setUserId($user_id)
    {
        $this->user_id = $user_id;
    }
    
    
}

