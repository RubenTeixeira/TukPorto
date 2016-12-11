<?php
namespace Course\DAL;

use Zend\Db\TableGateway\TableGateway;
use Course\Model\WayPoint;

class WayPointTable
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
    
    public function getWayPoint($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('waypoint_id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $id");
        }
        return $row;
    }
    
    public function saveWayPoint(WayPoint $waypoint)
    {
        $data = array(
            'name' => $waypoint->name,
            'description' => $waypoint->description,
            'gps_lat' => $waypoint->gps_lat,
            'gps_long' => $waypoint->gps_long,
            'course_id' => $waypoint->course_id,
        );
    
        $id = (int) $waypoint->waypoint_id;
        if ($id == 0) {
            $this->tableGateway->insert($data);
        } else {
            if ($this->getWayPoint($id)) {
                $this->tableGateway->update($data, array('waypoint_id' => $id));
            } else {
                throw new \Exception('WayPoint id does not exist');
            }
        }
    }
    
    public function deleteWayPoint($id)
    {
        $this->tableGateway->delete(array('waypoint_id' => (int) $id));
    }
    
    public function getCourseWayPoints($course_id)
    {
        $id  = (int) $course_id;
        $rowset = $this->tableGateway->select(array('course_id' => $id));
        
//         if (!$rowset->count()) {
//             throw new \Exception("Could not find row $id");
//         }
        return $rowset;
    }
}

