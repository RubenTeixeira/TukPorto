<?php
return array(
    'controllers' => array(
        'factories' => array(
            'Course\Controller\Course' => 'Course\Factory\CourseControllerFactory'
        )
    )
    // 'invokables' => array(
    // 'Course\Controller\Course' => 'Course\Controller\CourseController'
    // )
    ,
    'router' => array(
        'routes' => array(
            'course' => array(
                'type' => 'Literal',
                'options' => array(
                    // Change this to something specific to your module
                    'route' => '/course',
                    'defaults' => array(
                        // Change this value to reflect the namespace in which
                        // the controllers for your module are found
                        '__NAMESPACE__' => 'Course\Controller',
                        'controller' => 'Course',
                        'action' => 'index'
                    )
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    // This route is a sane default when developing a module;
                    // as you solidify the routes for your module, however,
                    // you may want to remove it and replace it with more
                    // specific routes.
                    'default' => array(
                        'type' => 'Segment',
                        'options' => array(
                            'route' => '/[:controller[/:action]]',
                            'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*'
                            ),
                            'defaults' => array()
                        )
                    )
                )
            )
        )
    ),
    'view_manager' => array(
        'template_path_stack' => array(
            'Course' => __DIR__ . '/../view'
        )
    ),
    'view_helpers' => array(
        'invokables' => array(
            'getCourseWayPoints' => 'Course\View\Helper\GetCourseWayPoints',
            'userNameById' => 'Course\View\Helper\UserNameById',
        )
    )
)
;
