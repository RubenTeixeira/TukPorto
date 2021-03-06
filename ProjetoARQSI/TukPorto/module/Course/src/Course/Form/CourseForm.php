<?php
namespace Course\Form;

use Zend\Form\Form;
use Zend\Form\Element\MultiCheckbox;

class CourseForm extends Form
{

    public function __construct($name = null)
    {
        // we want to ignore the name passed
        parent::__construct('course');
        
        $this->add(array(
            'name' => 'course_id',
            'type' => 'Hidden'
        ));
        
        $this->add(array(
            'name' => 'description',
            'type' => 'Text',
        ));
        $this->add(array(
            'type' => 'Zend\Form\Element\Date',
            'name' => 'date',
            'options' => array(
                'format' => 'Y-m-d'
            ),
            'attributes' => array(
                'min' => '2016-01-01',
                'max' => '2020-01-01',
                'step' => '1'
            ) // days; default step interval is 1 day

        ));
        
        $multiCheck = new MultiCheckbox('poi_select');
        $multiCheck->setLabel('Check the places you would like to visit');
        $multiCheck->setDisableInArrayValidator(true);
        $this->add($multiCheck);
        
        $this->add(array(
            'name' => 'user_id',
            'type' => 'Hidden'
        ));
        $this->add(array(
            'name' => 'submit',
            'type' => 'Submit',
            'attributes' => array(
                'value' => 'Create',
                'id' => 'submitbutton'
            )
        ));
    }
}
