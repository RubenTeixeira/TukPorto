<?php
namespace Tourist\Model;

use ZfcUser\Entity\User;
class Tourist extends User
{
    /**
     * @var int
     */
    protected $nationality;
    
    
    /**
     * Get nationality.
     *
     * @return Nationality
     */
    public function getNationality()
    {
        return $this->nationality;
    }
    
    /**
     * Set nationality.
     *
     * @param Nationality $nationality
     * @return UserInterface
     */
    public function setNationality($nationality)
    {
        $this->nationality = $nationality;
        return $this;
    }
    
  
}

