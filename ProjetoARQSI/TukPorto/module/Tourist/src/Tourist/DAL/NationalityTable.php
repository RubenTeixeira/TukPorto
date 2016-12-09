<?php
namespace Tourist\DAL;

use Zend\Db\TableGateway\TableGateway;

class NationalityTable
{
    protected $tableGateway;
    
    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }
    
    public function fetchAll()
    {
        $resultSet = $this->tableGateway->select();
        return $resultSet;
    }
    
    public function getNationality($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('nationality_id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $id");
        }
        return $row;
    }

}

