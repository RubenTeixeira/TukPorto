<?php
namespace Tourist\Model;

class Nationality
{
    public $nacionality_id;
    public $country_code;
    public $country_name;
    
    public function exchangeArray($data)
    {
        $this->nacionality_id = (!empty($data['nacionality_id'])) ? $data['nacionality_id'] : null;
        $this->country_code = (!empty($data['country_code'])) ? $data['country_code'] : null;
        $this->country_name = (!empty($data['country_name'])) ? $data['country_name'] : null;
    }
    
    public function getArrayCopy()
    {
        return get_object_vars($this);
    }

    public function getCountryCode()
    {
        return $this->country_code;
    }
    
    public function getCountryName()
    {
        return $this->country_name;
    }
}

