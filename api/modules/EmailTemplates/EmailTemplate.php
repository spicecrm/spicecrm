<?php
namespace SpiceCRM\modules\EmailTemplates;

use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\SpiceTemplateCompiler\Compiler;
use SpiceCRM\includes\authentication\AuthenticationController;

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

/*********************************************************************************

 * Description:  TODO: To be written.
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * Contributor(s): ______________________________________..
 ********************************************************************************/

// EmailTemplate is used to store email email_template information.
class EmailTemplate extends SugarBean {

	var $table_name = "email_templates";
	var $object_name = "EmailTemplate";
	var $module_dir = "EmailTemplates";


    /**
     * List of IDs of possible parent templates (to prevent recursions).
     * @var
     */
    public $idsOfParentTemplates = [];

	function __construct() {
		parent::__construct();
	}


    function parse( $bean, $additionalValues = null ){
        global $app_list_strings, $current_language;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $app_list_strings = return_app_list_strings_language($this->language);

        $retArray = [
            'subject' => $this->parsePlainTextField('subject', $bean, $additionalValues ),
            'body' => $this->parseHTMLTextField('body', $bean, $additionalValues ),
            # 'body_html' => '<style>'.$this->getStyle().'</style>'.$this->parseField('body_html', $bean, $additionalValues ),
            'body_html' => $this->parseHTMLTextField('body_html', $bean, $additionalValues ),
        ];
        $retArray['subject'] = preg_replace('#\s+#', ' ', $retArray['subject'] ); // multiple white spaces -> one

        return $retArray;
    }

    public function parseHTMLTextField( $field, $parentbean = null, $additionalValues = null )
    {
        $templateCompiler = new Compiler($this);
        $templateCompiler->idsOfParentTemplates = array_merge( $this->idsOfParentTemplates, [$this->id] );
        $html = $templateCompiler->compile($this->$field, $parentbean, $this->language, $additionalValues );
        return html_entity_decode($html);
    }

    public function parsePlainTextField($field, $parentbean = null, $additionalValues = null )
    {
        $templateCompiler = new Compiler($this);
        $templateCompiler->idsOfParentTemplates = array_merge( $this->idsOfParentTemplates, [$this->id] );
        $text = $templateCompiler->compileblock($this->$field, [ 'bean' => $parentbean ], $this->language, $additionalValues );
        return $text;
    }

    private function getStyle(){
        $style= '';
        if(!empty($this->style)){
            $styleRecord = $this->db->fetchByAssoc($this->db->query("SELECT csscode FROM sysuihtmlstylesheets WHERE id='{$this->style}'"));
            $style = html_entity_decode($styleRecord['csscode'], ENT_QUOTES);
        }
        return $style;
    }

}

