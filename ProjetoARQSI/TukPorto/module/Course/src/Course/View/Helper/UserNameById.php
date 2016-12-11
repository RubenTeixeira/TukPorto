<?php
/**
 * Course\View\Helper
 * 
 * @author
 * @version 
 */
namespace Course\View\Helper;

use Zend\View\Helper\AbstractHelper;

/**
 * View Helper
 */
class UserNameById extends AbstractHelper
{

    public function __invoke($id)
    {
        $sm = $this->getView()->getHelperPluginManager()->getServiceLocator(); 
        $mapper = $sm->get('zfcuser_user_mapper');
        $user = $mapper->findById($id);
        return $user->getUsername();
    }
}
