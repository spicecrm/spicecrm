/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
********************************************************************************/
function showHelp(step)
{url='http://www.spicecrm.io';name='helpWindowPopup';window.open(url,name);}
function setFocus(){focus=document.getElementById('button_next2');focus.focus();}

//added for postgre support:
// let user enter LC_COLLATE and LC_TYPE
// default is en_US.UTF-8
function displayAdditionalParamsForDbType(dbtype){
    switch(dbtype){
        case 'pgsql':
            //add 2 input fields LC_COLLATE + LC_TYPE
            if(!document.getElementById('additional_pgsql')){
                _pgsql_params = "<ul id='additional_pgsql'><li><label for='LC_COLLATE'>LC_COLLATE</label>: <input name='setup_db_lc_collate' id='setup_db_lc_collate' value='en_US.UTF-8' /></li><li><label for='LC_TYPE'>LC_TYPE</label>: <input name='setup_db_lc_type' id='setup_db_lc_type' value='en_US.UTF-8' /></li></ul>";
                _dbtypeField = document.getElementById('input_'+dbtype);
                _dbtypeField.innerHTML+=_pgsql_params;
                document.getElementById('setup_db_type_'+dbtype).checked=true;
            }
            break;

        default:
            //remove any additional_params container
            _additional_pgsql = document.getElementById('additional_pgsql');
            _additional_pgsql.parentNode.removeChild(_additional_pgsql);
    }
}