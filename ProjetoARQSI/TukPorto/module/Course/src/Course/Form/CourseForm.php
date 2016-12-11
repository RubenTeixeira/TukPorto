<?php
namespace Course\Form;

use Zend\Form\Form;

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
            'options' => array(
                'label' => 'Description'
            )
        ));
        $this->add(array(
            'type' => 'Zend\Form\Element\Date',
            'name' => 'date',
            'options' => array(
                'label' => 'Travel course date',
                'format' => 'Y-m-d'
            ),
            'attributes' => array(
                'min' => '2016-01-01',
                'max' => '2020-01-01',
                'step' => '1'
            ) // days; default step interval is 1 day

        ));
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
