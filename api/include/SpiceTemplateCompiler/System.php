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
namespace SpiceCRM\includes\SpiceTemplateCompiler;

class System
{
    private static $plugin_directories = [
        'include/SpiceTemplateCompiler/plugins',
        'custom/include/SpiceTemplateCompiler/plugins',
    ];

    public function __construct()
    {
        $this->loadPlugins();
    }

    public function __call($method, $args)
    {
        /*
        if(method_exists($this, $method))
            return call_user_func([$this, $method], $args);
        */
        // try to use form custom plugins
        $call = "\SpiceCRM\custom\includes\SpiceTemplateCompiler\plugins\\$method";
        if(function_exists($call))
            return call_user_func($call, $args);

        // try to use from core plugins
        $call = "SpiceCRM\includes\SpiceTemplateCompiler\plugins\\$method";
        if(function_exists($call))
            return call_user_func($call, $args);

        return false;
        //throw new Exception("No method or function found to use!");
    }

    /**
     * because autoloading of functions doesn't work in PHP/autoloader, all files in the dedicated directories will be included, so the functions will be available in their respective namespaces.
     */
    private function loadPlugins()
    {
        foreach(static::$plugin_directories as $dir)
        {
            $dir_handler = opendir($dir);
            if(!$dir_handler)
                continue;

            while (false !== ($entry = readdir($dir_handler)))
            {
                if(strpos($entry, '.php') === false)
                    continue;

                include_once("$dir/$entry");
            }

            closedir($dir_handler);
        }
    }
}
