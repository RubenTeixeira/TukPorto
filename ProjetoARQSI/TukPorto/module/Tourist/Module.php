<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/Tourist for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace Tourist;

use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\TableGateway;
use Tourist\DAL\NationalityTable;
use Tourist\Model\Nationality;
use PDO;

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
        
        $em = $eventManager->getSharedManager();
        // custom form fields
        
        $em->attach('ZfcUser\Form\RegisterFilter', 'init', function ($e) {
            $filter = $e->getTarget();
            $filter->add(array(
                'name' => 'nationality',
                'required' => true
            ));
        });
        
        $services = $e->getApplication()->getServiceManager();
        $em->attach('ZfcUser\Form\Register', 'init', function ($e) use ($services) {
            $db = $services->get('Zend\Db\Adapter\Adapter');
            /* @var $form \ZfcUser\Form\Register */
            $form = $e->getTarget();
            $options = array();
            $result = $db->query('SELECT nationality_id, country_name FROM nationality ORDER BY country_name ASC', $db::QUERY_MODE_EXECUTE)
                ->toArray();
            $options = array_column($result, 'country_name', 'nationality_id');
            $form->add(array(
                'type' => 'Zend\Form\Element\Select',
                'name' => 'nationality',
                'options' => array(
                    'label' => 'Nationality',
                    'disable_inarray_validator' => true,
                    'empty_option' => 'Please select your country',
                    'value_options' => $options
                )
            ));
        });
        
        $zfcServiceEvents = $e->getApplication()
            ->getServiceManager()
            ->get('zfcuser_user_service')
            ->getEventManager();
        
        $zfcServiceEvents->attach('register', function ($e) {
            $form = $e->getParam('form');
            $user = $e->getParam('user');
            $user->setNationality($form->get('nationality')
                ->getValue());
            // print_r($user);
        });
        
        // do stuff after it stores
        // $zfcServiceEvents->attach('register.post', function($e) {
        /* $user = $e->getParam('user'); */
        // });
    }

    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                'Tourist\DAL\NationalityTable' => function ($sm) {
                    $tableGateway = $sm->get('NationalityTableGateway');
                    $table = new NationalityTable($tableGateway);
                    return $table;
                },
                'NationalityTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Nationality());
                    return new TableGateway('nationality', $dbAdapter, null, $resultSetPrototype);
                }
            )
        );
    }

    public function getViewHelperConfig()
    {
        return array(
            'factories' => array(
                'getNationality' => function ($sm) {
                    $helper = new View\Helper\UserNationality();
                    $helper->setServiceLocator($sm);
                    return $helper;
                }
            )
        );
    }
}
