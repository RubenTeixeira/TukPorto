<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/Course for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace Course\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Course\Form\CourseForm;
use Course\Model\Course;
use Zend\ServiceManager\ServiceLocatorInterface;
use Course\Service\CancelaService;
use Course\Model\WayPoint;

class CourseController extends AbstractActionController
{

    protected $courseTable;

    protected $wayPointTable;

    protected $sm;

    public function __construct($serviceLocator)
    {
        $this->sm = $serviceLocator;
    }
   
    public function indexAction()
    {
        return new ViewModel(array(
            'courses' => $this->getCourseTable()->fetchAll()
        ));
    }

    public function addAction()
    {
        session_start();
        $user = $this->zfcUserAuthentication()->getIdentity();
        if (!$user) {
            return $this->redirect()->toRoute('course');
        }
        $userid = $user->getId();
        $form = new CourseForm();
        $request = $this->getRequest();
        if ($request->isPost()) {
            $course = new Course();
            $form->setInputFilter($course->getInputFilter());
            
            $request->getPost()['user_id'] = $userid;
            $form->setData($request->getPost());
            if ($form->isValid()) {
                $course->exchangeArray($form->getData());
                $this->getCourseTable()->saveCourse($course);
                $this->saveWayPoints($course, $form);
                // Redirect to list of courses
                return $this->redirect()->toRoute('course');
            } else
                echo "$form->getMessages";
        } 
        $pois = CancelaService::getPois();
        
        $poisArray = array();
        foreach ($pois as $poi) {
            
            $readings = CancelaService::getReadingsFromPoi($poi->Local->Nome);
            // Sort by date, descending
            $date = array();
            foreach ($readings as $key => $row) {
                $date[$key] = $row['Data'];
            }
            array_multisort($date, SORT_DESC, $readings);
            // This is temporary, a single foreach is enough
            // instead of traversing the same data twice.
            $poisArray[] = array(
                'name' => $poi->Nome,
                'description' => $poi->Descricao,
                'gps_lat' => $poi->Local->GPS_Lat,
                'gps_long' => $poi->Local->GPS_Long,
                'local' => $poi->Local->Nome,
                'readings' => array(
                    'id' => $poi->Nome,
                    'first' => array(
                        'date' => $readings[0]['Data'],
                        'temp' => $readings[0]['Temp'],
                        'wind' => $readings[0]['Vento'],
                        'hum' => $readings[0]['Humidade']
                    ),
                    'second' => array(
                        'date' => $readings[1]['Data'],
                        'temp' => $readings[1]['Temp'],
                        'wind' => $readings[1]['Vento'],
                        'hum' => $readings[1]['Humidade']
                    )
                )
            );
        }
        
        $multiOptions = array();
        foreach ($poisArray as $poi) {
            $multiOptions[] = array(
                'value' => $poi['name'],
                'label' => $poi['name']." - ".$poi['description'],
                'attributes' => array(
                    'id' => 'checkbox_' . $poi['readings']['id'],
                    'description' => $poi['description'],
                    'gps_lat' => $poi['gps_lat'],
                    'gps_long' => $poi['gps_long'],
                    'onclick' => 'showWeather(\'' . json_encode($poi['readings'], JSON_HEX_TAG) . '\')'
                )
            );
        }
        // end of redundancy :)
        $checkOptions = array_column($poisArray, 'name');
        $multiCheck = $form->get('poi_select');
        $multiCheck->setValueOptions($multiOptions);
        
        return array(
            'form' => $form
        );
    }

    public function editAction()
    {
        $user = $this->zfcUserAuthentication()
        ->getIdentity();
        if (!$user)
        {
            return $this->redirect()->toRoute('course');
        }
        
        $id = (int) $this->params()->fromRoute('id', 0);
        if (! $id) {
            return $this->redirect()->toRoute('course', array(
                'action' => 'add'
            ));
        }
        
        try {
            $course = $this->getCourseTable()->getCourse($id);
        } catch (\Exception $ex) {
            return $this->redirect()->toRoute('course', array(
                'action' => 'index'
            ));
        }
        // Only creator can edit
        if ($user->getId() != $course->user_id)
        {
            return $this->redirect()->toRoute('course', array(
                'action' => 'index'
            ));
        }
        $form = new CourseForm();
        $form->bind($course);
        $form->get('submit')->setAttribute('value', 'Edit');
        
        $request = $this->getRequest();
        if ($request->isPost()) {
            $form->setInputFilter($course->getInputFilter());
            $form->setData($request->getPost());
            
            if ($form->isValid()) {
                $this->getCourseTable()->saveCourse($course);
                return $this->redirect()->toRoute('course');
            }
        }
        return new ViewModel(array(
            'id' => $id,
            'form' => $form
        ));
    }

    public function deleteAction()
    {
        $user = $this->zfcUserAuthentication()->getIdentity();
        if (!$user) {
            return $this->redirect()->toRoute('course');
        }
        $id = (int) $this->params()->fromRoute('id', 0);
        if (!$id) {
            print "No id!";
            return $this->redirect()->toRoute('course');
        }
        try {
            $course = $this->getCourseTable()->getCourse($id);
        } catch (\Exception $ex) {
            print "Not found!";
            return $this->redirect()->toRoute('course', array(
                'action' => 'index'
            ));
        }
        // Only creator can delete
        if ($user->getId() != $course->getUserId())
        {
            return $this->redirect()->toRoute('course', array(
                'action' => 'index'
            ));
        }
        $request = $this->getRequest();
        if ($request->isPost()) {
            $del = $request->getPost('del', 'No');
            
            if ($del == 'Yes') {
                $id = (int) $request->getPost('id');
                $this->getCourseTable()->deleteCourse($id);
            }
            
            return $this->redirect()->toRoute('course');
        }
        
        return new ViewModel(array(
            'id' => $id,
            'course' => $course
        ));
    }

    private function saveWayPoints($course, $form)
    {
        $multiCheck = $form->get('poi_select');
        $selectedPois = $multiCheck->getValue();
        foreach ($selectedPois as $poi) {
            $poi = CancelaService::getPoiByName($poi);
            print_r($poi);
            $newWayPoint = new WayPoint();
            $newWayPoint->setCourseId($course->getCourseId());
            $newWayPoint->setName($poi->Nome);
            $newWayPoint->setDescription($poi->Descricao);
            $newWayPoint->setGpsLatitude($poi->Local->GPS_Lat);
            $newWayPoint->setGpsLongitude($poi->Local->GPS_Long);
            $this->wayPointTable->saveWayPoint($newWayPoint);
        }
    }

    public function getCourseTable()
    {
        return $this->courseTable;
    }

    public function getWayPointTable()
    {
        return $this->wayPointTable;
    }

    public function setCourseTable($courseTable)
    {
        $this->courseTable = $courseTable;
    }

    public function setWayPointTable($wayPointTable)
    {
        $this->wayPointTable = $wayPointTable;
    }

    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->sm = $serviceLocator;
    }

    public function getServiceLocator()
    {
        return $this->sm;
    }
}
