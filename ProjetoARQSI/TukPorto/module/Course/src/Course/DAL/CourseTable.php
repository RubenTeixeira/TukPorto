<?php
namespace Course\DAL;

use Zend\Db\TableGateway\TableGateway;
use Course\Model\Course;

class CourseTable
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
    
    public function getCourse($id)
    {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('course_id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $id");
        }
        return $row;
    }
    
    public function saveCourse(Course $course)
    {
        $data = array(
            'description' => $course->description,
            'date' => $course->date,
            'user_id' => $course->user_id,
        );
    
        $id = (int) $course->course_id;
        if ($id == 0) {
            $this->tableGateway->insert($data);
        } else {
            if ($this->getCourse($id)) {
                $this->tableGateway->update($data, array('course_id' => $id));
            } else {
                throw new \Exception('Course id does not exist');
            }
        }
    }
    
    public function deleteCourse($id)
    {
        $this->tableGateway->delete(array('course_id' => (int) $id));
    }
}

