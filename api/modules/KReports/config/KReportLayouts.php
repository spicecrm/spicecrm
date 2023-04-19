<?php
/*********************************************************************************
 * This file is part of KReporter. KReporter is an enhancement developed
 * by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 *
 * This Version of the KReporter is licensed software and may only be used in
 * alignment with the License Agreement received with this Software.
 * This Software is copyrighted and may not be further distributed without
 * witten consent of aac services k.s.
 *
 * You can contact us at info@kreporter.org
 ********************************************************************************/



$kreportLayouts = [
    '1x1' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '100%',
                'height' => '100%'
            ]
        ]
    ],
    '1x2' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '50%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '50%',
                'width' => '50%',
                'height' => '100%'
            ],
        ]
    ],
    '1x3' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '33%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '33%',
                'width' => '34%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '67%',
                'width' => '33%',
                'height' => '100%'
            ]
        ]
    ],
    '1x4' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '25%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '25%',
                'width' => '25%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '50%',
                'width' => '25%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '75%',
                'width' => '25%',
                'height' => '100%'
            ]
        ]
    ],
    '2x2' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '50%',
                'height' => '50%'
            ],
            [
                'top' => '0%',
                'left' => '50%',
                'width' => '50%',
                'height' => '50%'
            ],
            [
                'top' => '50%',
                'left' => '0%',
                'width' => '50%',
                'height' => '50%'
            ],
            [
                'top' => '50%',
                'left' => '50%',
                'width' => '50%',
                'height' => '50%'
            ]
        ]
    ],
    '2x2wide' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '33%',
                'height' => '50%'
            ],
            [
                'top' => '0%',
                'left' => '33%',
                'width' => '67%',
                'height' => '50%'
            ],
            [
                'top' => '50%',
                'left' => '0%',
                'width' => '33%',
                'height' => '50%'
            ],
            [
                'top' => '50%',
                'left' => '33%',
                'width' => '67%',
                'height' => '50%'
            ]
        ]
    ],
    '1x3x2' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '67%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '67%',
                'width' => '33%',
                'height' => '50%'
            ],
            [
                'top' => '50%',
                'left' => '67%',
                'width' => '33%',
                'height' => '50%'
            ]
        ]
    ],
    '1x2x1' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '67%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '67%',
                'width' => '33%',
                'height' => '100%'
            ]
        ]
    ],
    '1+1+2' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '33%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '33%',
                'width' => '33%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '66%',
                'width' => '34%',
                'height' => '50%'
            ],
            [
                'top' => '50%',
                'left' => '66%',
                'width' => '34%',
                'height' => '50%'
            ]
        ]
    ],
    '1x2x2' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '50%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '50%',
                'width' => '25%',
                'height' => '100%'
            ],
            [
                'top' => '0%',
                'left' => '75%',
                'width' => '25%',
                'height' => '100%'
            ]
        ]
    ],
    '2x1x4' => [
        'items' => [
            [
                'top' => '0%',
                'left' => '0%',
                'width' => '100%',
                'height' => '50%'
            ],
            [
                'top' => '50%',
                'left' => '0%',
                'width' => '25%',
                'height' => '50%'
            ],
            [
                'top' => '50%',
                'left' => '25%',
                'width' => '25%',
                'height' => '50%'
            ],
            [
                'top' => '50%',
                'left' => '50%',
                'width' => '25%',
                'height' => '50%'
            ],
            [
                'top' => '50%',
                'left' => '75%',
                'width' => '25%',
                'height' => '50%'
            ]
        ]
    ]
];

if(file_exists('custom/modules/KReports/config/KReportLayouts.php'))
    include('custom/modules/KReports/config/KReportLayouts.php');

