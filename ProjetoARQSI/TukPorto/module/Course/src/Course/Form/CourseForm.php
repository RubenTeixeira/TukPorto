<?php
namespace Course\Form;

use Zend\Form\View\Helper\Form;

class CourseForm extends Form
{
    public function __construct($name = null) {
        // we want to ignore the name passed
        parent::__construct('course');
    
        $this->add(array(
            'name' => 'id',
            'type' => 'Hidden',
        ));
    
        $this->add(array(
            'name' => 'userId',
            'type' => 'Zend\Form\Element\Hidden',
            'attributes' => array(
                'type' => 'hidden'
            ),
        ));
    
        $this->add(array(
            'name' => 'email',
            'type' => 'Text',
            'options' => array(
                'label' => 'Email:',
            ),
        ));
    
        $this->add(array(
            'name' => 'password',
            'type' => 'Text',
            'options' => array(
                'label' => 'Password:',
            ),
        ));
    
        $this->add(array(
            'name' => 'nacionality',
            'type' => 'Text',
            'options' => array(
                'label' => 'Nacionality:',
            ),
        ));
    
        $this->add(array(
            'name' => 'submit',
            'type' => 'Submit',
            'attributes' => array(
                'value' => 'Go',
                'id' => 'submitbutton',
            ),
        ));
    
    }
}

