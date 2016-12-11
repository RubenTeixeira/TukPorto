<?php
namespace Course\Factory;

use Course\Controller\CourseController;
use Zend\ServiceManager\FactoryInterface;

class CourseControllerFactory implements FactoryInterface
{

    /**
     * {@inheritDoc}
     * @see \Zend\ServiceManager\FactoryInterface::createService()
     */
    public function createService(\Zend\ServiceManager\ServiceLocatorInterface $serviceLocator)
    {
        $parentLocator = $serviceLocator->getServiceLocator();
        $courseTable = $parentLocator->get('Course\DAL\CourseTable');
        $wayPointTable = $parentLocator->get('WayPoint\DAL\WayPointTable');
        $controller = new CourseController();
        $controller->setCourseTable($courseTable);
        $controller->setWayPointTable($wayPointTable);
        return $controller;
        
    }

}

