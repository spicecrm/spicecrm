<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

/**
 * delete current content in sysfts table
 * insert default FTS settings for all modules
 * initiliaze indexes
 */

require_once 'include/SpiceFTSManager/SpiceFTSCreator.php';
require_once 'include/SpiceFTSManager/SpiceFTSLoader.php';

if ($current_user->is_admin) {

    $loader = new SpiceFTSLoader();
    if ($_POST['ftsdefaultconf_process'] > 0) {
        //collect values for REST call
        //https://packages.spicecrm.io/ftsconfig
        $route = "referencefts";
        $package = (isset($_POST['ftsdefaultconf_package']) ? $_POST['ftsdefaultconf_package'] : "*");
        $version = $_POST['ftsdefaultconf_version'];
        $endpoint = implode("/", array($route, $package, $version));
        $loader->loadDefaultConf($endpoint, array('route' => $route, 'package' => $package, 'version' => $version));

        //initialize
        $spiceftsconf = new SpiceFTSCreator();
        $spiceftsconf->initialize();

    } else {
        //display form
        $loader->displayDefaultConfForm($currentconf);
    }
}
else{
    die("Access denied");
}
