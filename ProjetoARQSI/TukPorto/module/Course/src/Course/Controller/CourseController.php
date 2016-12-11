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

class CourseController extends AbstractActionController
{

    protected $courseTable;

    protected $wayPointTable;
    
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
    
    // public function addAction()
    // {
    // $form = new CourseForm();
    // $form->get('submit')->setValue('Add');
    
    // $request = $this->getRequest();
    // if ($request->isPost()) {
    // $course = new Course();
    // $form->setInputFilter($course->getInputFilter());
    // $form->setData($request->getPost());
    
    // if ($form->isValid()) {
    // $aluno->exchangeArray($form->getData());
    // $this->getAlunoTable()->saveAluno($aluno);
    
    // // Redirect to list of alunos
    // return $this->redirect()->toRoute('escola');
    // }
    // }
    // return array('form' => $form);
    // }
    
    // public function editAction()
    // {
    // $id = (int) $this->params()->fromRoute('id', 0);
    // if (!$id) {
    // return $this->redirect()->toRoute('escola', array(
    // 'action' => 'add'
    // ));
    // }
    
    // // Get the Alno with the specified id. An exception is thrown
    // // if it cannot be found, in which case go to the index page.
    // try {
    // $aluno = $this->getAlunoTable()->getAluno($id);
    // }
    // catch (\Exception $ex) {
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
    // 'form' => $form,
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
}
