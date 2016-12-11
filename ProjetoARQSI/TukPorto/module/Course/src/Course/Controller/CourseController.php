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
use Zend\Form\Element\MultiCheckbox;
use Course\Form\CourseForm;
use Course\Model\Course;
use Zend\ServiceManager\ServiceLocatorInterface;
use Course\Service\CancelaService;

class CourseController extends AbstractActionController
{

    protected $courseTable;

    protected $wayPointTable;

    protected $sm;

    public function __construct($serviceLocator)
    {
        $this->sm = $serviceLocator;
    }
    
    // public function configAction()
    // {
    // $form = new ConfigForm();
    // $form->get('submit')->setValue('Set');
    
    // session_start();
    
    // $request = $this->getRequest();
    // if ($request->isPost()) {
    // $_SESSION['server'] = $request->getPost()['server'];
    
    // return $this->redirect()->toRoute('escola', array('controller'=>'escola', 'action' => 'login'));
    // }
    // else
    // {
    // if(!empty($_SESSION['server']))
    // $form->setAttribute("Server", $_SESSION['server']);
    
    // return array('form' => $form);
    // }
    // }
    
    // public function loginAction()
    // {
    // $form = new LoginForm();
    // $form->get('submit')->setValue('Login');
    
    // $request = $this->getRequest();
    // if ($request->isPost()) {
    
    // session_start();
    // ImoServices::Logout();
    
    // $credenciais = new Credenciais();
    // $form->setInputFilter($credenciais->getInputFilter());
    // $form->setData($request->getPost());
    
    // if ($form->isValid()) {
    // $credenciais->exchangeArray($form->getData());
    
    // if( ImoServices::Login($credenciais) )
    
    // // Redirect to values
    // return $this->redirect()->toRoute('escola', array('controller'=>'escola', 'action' => 'values'));
    // }
    // }
    // return array('form' => $form);
    // }
    
    // public function logoutAction()
    // {
    // ImoServices::Logout();
    
    // return $this->redirect()->toRoute('escola', array('controller'=>'escola', 'action' => 'login'));
    // }
    
    // public function valuesAction()
    // {
    // $body = ImoServices::getValues();
    
    // return new ViewModel(array(
    // 'values' => Json::decode($body)
    // ));
    // }
    public function indexAction()
    {
        return new ViewModel(array(
            'courses' => $this->getCourseTable()->fetchAll()
        ));
    }

    public function addAction()
    {
        $form = new CourseForm();
        
        $request = $this->getRequest();
        if ($request->isPost()) {
            $course = new Course();
            // $form->setInputFilter($course->getInputFilter());
            $userid = $this->zfcUserAuthentication()
                ->getIdentity()
                ->getId();
            $request->getPost()['user_id'] = $userid;
            $form->setData($request->getPost());
            
            if ($form->isValid()) {
                $course->exchangeArray($form->getData());
                $this->getCourseTable()->saveCourse($course);
                saveWayPoints($course, $form);
                // Redirect to list of courses
                return $this->redirect()->toRoute('course');
            }
        }
        if (! CancelaService::Login()) {
            // alert service down
            return $this->redirect()->toRoute('course');
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
        foreach ($poisArray as $poi)
        {
            $multiOptions[] = array(
                'value' => $poi['local'],
                'label' => $poi['name'],
                'attributes' => array(
                    'id' => 'checkbox_'.$poi['readings']['id'],
                    'onclick' => 'showWeather(\'' . json_encode($poi['readings'],JSON_HEX_TAG) . '\')',
                )
            );
        }
        $checkOptions = array_column($poisArray, 'name');
        $multiCheck = new MultiCheckbox('poi_select');
        $multiCheck->setLabel('Check the places you would like to visit');
        $multiCheck->setValueOptions($multiOptions);
        $form->add($multiCheck);
        return array(
            'form' => $form
        );
    }
    
    // public function editAction()
    // {
    // $id = (int) $this->params()->fromRoute('id', 0);
    // if (! $id) {
    // return $this->redirect()->toRoute('escola', array(
    // 'action' => 'add'
    // ));
    // }
    
    // // Get the Alno with the specified id. An exception is thrown
    // // if it cannot be found, in which case go to the index page.
    // try {
    // $aluno = $this->getAlunoTable()->getAluno($id);
    // } catch (\Exception $ex) {
    // return $this->redirect()->toRoute('escola', array(
    // 'action' => 'index'
    // ));
    // }
    
    // $form = new AlunoForm();
    // $form->bind($aluno);
    // $form->get('submit')->setAttribute('value', 'Edit');
    
    // $request = $this->getRequest();
    // if ($request->isPost()) {
    // $form->setInputFilter($aluno->getInputFilter());
    // $form->setData($request->getPost());
    
    // if ($form->isValid()) {
    // $this->getAlunoTable()->saveAluno($aluno);
    
    // // Redirect to list of alunos
    // return $this->redirect()->toRoute('escola');
    // }
    // }
    
    // return array(
    // 'id' => $id,
    // 'form' => $form
    // );
    // }
    public function deleteAction()
    {
        $id = (int) $this->params()->fromRoute('id', 0);
        if (! $id) {
            return $this->redirect()->toRoute('escola');
        }
        
        $request = $this->getRequest();
        if ($request->isPost()) {
            $del = $request->getPost('del', 'No');
            
            if ($del == 'Yes') {
                $id = (int) $request->getPost('id');
                $this->getAlunoTable()->deleteAluno($id);
            }
            
            // Redirect to list of alunos
            return $this->redirect()->toRoute('escola');
        }
        
        return array(
            'id' => $id,
            'aluno' => $this->getAlunoTable()->getAluno($id)
        );
    }

    private function saveWayPoints($course, $form)
    {}

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
