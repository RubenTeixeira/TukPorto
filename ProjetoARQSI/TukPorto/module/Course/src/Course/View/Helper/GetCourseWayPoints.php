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
class GetCourseWayPoints extends AbstractHelper
{

public function __invoke($course_id)
    {
        $sm = $this->getView()->getHelperPluginManager()->getServiceLocator();
        $table = $sm->get('WayPoint\DAL\WayPointTable');
        return $table->getCourseWayPoints($course_id);
    }
}
