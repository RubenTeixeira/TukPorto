<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/Course for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace Course;

use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Course\Model\Course;
use Course\Model\WayPoint;
use Course\DAL\CourseTable;
use Course\DAL\WayPointTable;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\TableGateway;
use Tourist\DAL\TouristTable;
use Tourist\Model\Tourist;

class Module implements AutoloaderProviderInterface
{

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php'
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    // if we're in a namespace deeper than one level we need to fix the \ in the path
                    __NAMESPACE__ => __DIR__ . '/src/' . str_replace('\\', '/', __NAMESPACE__)
                )
            )
        );
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function onBootstrap(MvcEvent $e)
    {
        // You may not need to do this if you're doing it elsewhere in your
        // application
        $eventManager = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);
    }

    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                'Course\DAL\CourseTable' => function ($sm) {
                    $tableGateway = $sm->get('CourseTableGateway');
                    $table = new CourseTable($tableGateway);
                    return $table;
                },
                'CourseTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Course());
                    return new TableGateway('course', $dbAdapter, null, $resultSetPrototype);
                },
                'WayPoint\DAL\WayPointTable' => function ($sm) {
                    $tableGateway = $sm->get('WayPointTableGateway');
                    $table = new WayPointTable($tableGateway);
                    return $table;
                },
                'WayPointTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new WayPoint());
                    return new TableGateway('waypoint', $dbAdapter, null, $resultSetPrototype);
                },
                'Tourist\DAL\TouristTable' => function ($sm) {
                    $tableGateway = $sm->get('TouristTableGateway');
                    $table = new TouristTable($tableGateway);
                    return $table;
                },
                'TouristTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Tourist());
                    return new TableGateway('user', $dbAdapter, null, $resultSetPrototype);
                }
            )
        );
    }
}
