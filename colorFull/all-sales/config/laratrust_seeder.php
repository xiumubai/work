<?php

return [
    'role_structure' => [
        'super-administrator' => [
            'display_name' => '超级管理员',
            'permissions' => [
                'staff' => 'create,update,delete,list,detail',
                'task' => 'create,update,delete,list,detail',
            ],
        ],
        'department-administrator' => [
            'display_name' => '部门管理员',
            'permissions' => [
                'task' => 'create,update,delete,list,detail',
            ],
        ],
        'hr' => [
            'display_name' => '人事',
            'permissions' => [
                'staff' => 'create,update,delete,list,detail',
            ],
        ],
        'point-administrator' => [
            'display_name' => '积分管理员',
            'permissions' => [

            ],
        ]
    ],
    'permission_structure' => [
        // 'cru_user' => [
        //     'profile' => 'c,r,u'
        // ],
    ],
    'modules_map' => [
        'staff' => '员工',
        'task' => '任务',
    ],
    'permissions_map' => [
        'create' => '创建',
        'update' => '修改',
        'delete' => '删除',
        'list'   => '浏览',
        'detail' => '查看',
        // 'c' => [
        //     'title' => '创建',
        //     'key' => 'create',
        // ],
        // 'c' => [
        //     'title' => '修改',
        //     'key' => 'update',
        // ],
        // 'c' => [
        //     'title' => '删除',
        //     'key' => 'delete',
        // ],
        // 'l' => [
        //     'title' => '列表',
        //     'key' => 'list',
        // ],
        // 'l' => [
        //     'title' => '详情',
        //     'key' => 'detail',
        // ],
    ]
];
