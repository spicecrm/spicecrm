{literal}
<?php
$manifest {/literal} = array(
    'acceptable_sugar_flavors' => array(
        'CE'
    ),
    'acceptable_sugar_versions' => array(
        {if $regexmatches != ''}
        'regex_matches' => array(
            '{$regexmatches}'
        )
        {/if}
    ),
    'is_uninstallable' => false,
    'name' => '{$name}',
    'author' => '20reasons Business Solutions',
    'published_date' => '{$publishdate}',
    'version' => '{$version}',
    'type' => 'patch',
    'copy_files' =>
    array(
        'from_dir' => 'files',
        'to_dir' => '',
        'force_copy' =>
        array(
        ),
    ),
);
