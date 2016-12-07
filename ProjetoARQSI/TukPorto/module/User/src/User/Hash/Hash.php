<?php
namespace User\Hash;

/**
 *
 * @author ruben
 * @version 
 */



class Hash
{
    static $cost = 10;

    public function __construct(){
        
    }
    
    /**
     * Strategy pattern: call helper as broker method
     */
    public function hashPassword($password){
        global $cost;
        $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
        $salt = sprintf("$2a$%02d$", $cost) . $salt;
        return crypt($password, $salt);
    }
    
    public function checkPassword($password, $hash) {
        if ( hash_equals($hash, crypt($password, $hash)) ) {
            return TRUE;
        }
        return FALSE;
    }
}
