<?php
namespace Tourist\View\Helper;

use Zend\View\Helper\AbstractHelper;
use Zend\ServiceManager\ServiceLocatorInterface;

class UserNationality extends AbstractHelper
{
    
    /**
     * @var Locator Service
     */
    protected $serviceLocator;
    
    
    /**
     * __invoke
     *
     * @access public
     * @return anonymous Nationality obj
     */
    public function __invoke($id)
    {
        $sm = $this->getServiceLocator();
        $table = $sm->get('NationalityTable');
        return $table->getNationality($id);
    }
    

    public function getServiceLocator()
    {
        return $this->serviceLocator;
    }
    

    public function setServiceLocator(ServiceLocatorInterface $serviceManager)
    {
        $this->serviceLocator = $serviceManager;
        return $this;
    }
}

