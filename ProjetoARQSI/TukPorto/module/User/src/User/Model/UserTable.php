<?php
namespace User\Model;

use Zend\Db\TableGateway\TableGateway;
use User\Hash\Hash;

class UserTable
{
    protected $tableGateway;
    
    public function __construct(TableGateway $tableGateway) {
        $this -> tableGateway = $tableGateway;
    }
    
    public function fetchAll() {
        $resultSet = $this->tableGateway->select();
        return $resultSet;
    }
    public function getUser($id) {
        $id = (int) $id;
        $rowSet = $this->tableGateway->select(array('id' => $id));
        $row = $rowSet->current();
        if (!$row) {
            throw new \Exception("Could not find row $id");
        }
        return $row;
    }
    public function saveUser(User $user) {
        $hasher = new Hash();
        $pw_hash = $hasher->hashPassword($user->password);
        $data = array (
            'name' => $user -> name,
            'email' => $user -> email,
            'nacionality' => $user -> nacionality,
            'password' => $pw_hash,
        );
    
        $id = (int) $user->id;
        if ($id == 0) {
            $this->tableGateway->insert($data);
        } else {
            if ($this->getUser($id)) {
                $this->tableGateway->update($data, array('id' => $id));
            } else {
                throw new \Exception("User does not exist");
            }
        }
    }
    public function deleteUser($id) {
        $this->tableGateway->delete(array('id' => (int) $id));
    }
}

