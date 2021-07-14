<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

$kreportColors = [
    'default' => [
        'name' => 'default KReporter Theme',
        'colors' => [
            '#862C7E',
            '#99C21C',
            '#EA9150',
            '#81789E',
            '#353535'
        ]
    ],
    'spice' => [
        'name' => 'SpiceCRM Theme',
        'colors' => [
            '#CA1B1F',
            '#FCB95B',
            '#95AEC5',
            '#7DC37D',
            '#0079BC',
            '#F88962',
            '#34BECD'
        ]
    ],
    'possible' => [
        'name' => 'Possible',
        'colors' => [
            '#F9F5F2',
            '#B1C5C3',
            '#DF822A',
            '#E3D39B',
            '#7E9249',
            '#7D8C89'
        ]
    ],
    'twilight' => [
        'name' => 'Twilight',
        'colors' => [
            '#0052A3',
            '#48BCE7',
            '#00BEA1',
            '#D2D900',
            '#B7B300'
        ]
    ],
    'polynesianparadise' => [
        'name' => 'Polynesian Paradise',
        'colors' => [
            '#E2EF79',
            '#BDD273',
            '#719126',
            '#76C4B6',
            '#419FA7',
            '#FFAE58',
            '#A94312',
            '#F578C8',
            '#B80360'
        ]
    ],
    'mountainsunset' => [
        'name' => 'Mountain Sunset',
        'colors' => [
            '#6484B3',
            '#4D6388',
            '#4B5C63',
            '#915756',
            '#BC664F',
            '#FA984F',
            '#FEC864',
            '#FFE779'
        ]
    ],
    'brightandneutral' => [
        'name' => 'Bright & Neutral',
        'colors' => [
            '#9AB854',
            '#09A4B8',
            '#F6273F',
            '#A7A7A0',
            '#454543'
        ]
    ],
    'kmonov' => [
        'name' => 'Monochrome KReporter Theme (violet)',
        'colors' => [
            '#812C7A'
        ]
    ],
    'kmonog' => [
        'name' => 'Monochrome KReporter Theme (green)',
        'colors' => [
            '#99c21c'
        ]
    ]
];

if(file_exists('custom/modules/KReports/config/KReportColors.php'))
    include('custom/modules/KReports/config/KReportColors.php');
