<?php
namespace Tourist\Model;

use ZfcUser\Entity\User;

class Tourist extends User
{

    /**
     *
     * @var int
     */
    protected $nationality;

    public function exchangeArray($data)
    {
        $this->setId(! empty($data['user_id'])) ? $data['user_id'] : null;
        $this->setUsername(! empty($data['username'])) ? $data['username'] : null;
        $this->setEmail(! empty($data['email'])) ? $data['email'] : null;
        $this->setDisplayName(! empty($data['display_name'])) ? $data['display_name'] : null;
        $this->setPassword(! empty($data['password'])) ? $data['password'] : null;
        $this->setState(! empty($data['state'])) ? $data['state'] : null;
        $this->nationality = (! empty($data['nationality'])) ? $data['nationality'] : null;
    }

//     public function getArrayCopy()
//     {
//         return get_object_vars($this);
//     }

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

