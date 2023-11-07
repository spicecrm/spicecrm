<?php

namespace SpiceCRM\modules\TextSnippets;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SpiceTemplateCompiler\Compiler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;

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
// TextSnippet is used to store text snippets information.
class TextSnippet extends SpiceBean
{

    /**
     * List of IDs of possible parent templates (to prevent recursions).
     * @var array
     */
    public array $idsOfParentTemplates = [];

// not needed, unless something is done from within the constructor
//    function __construct()
//    {
//        parent::__construct();
//    }

    function parse($bean, $additionalValues = null, $additionalBeans = [])
    {
        global $app_list_strings;
        $app_list_strings = SpiceUtils::returnAppListStringsLanguage($this->language);

        $retArray = [
            'body' => $this->parseHTMLTextField('body', $bean, $additionalValues, $additionalBeans),
        ];

        return $this->callContentMethod($retArray);
    }

    /**
     * call the content method and return the adjusted html content by the method
     * @param array $retArray
     * @return mixed
     */
    private function callContentMethod(array $retArray)
    {
        if (empty($this->content_method)) return $retArray;

        $classMethod = SpiceUtils::loadExecutionClassMethod($this->content_method);

        if (!$classMethod) return $retArray;

        return $classMethod->class->{$classMethod->method}($this, $retArray);
    }

    /**
     * parses a text snippet and returns html
     * @param $field
     * @param $parentBean
     * @param $additionalValues
     * @param array $additionalBeans
     * @return string
     */
    public function parseHTMLTextField($field, $parentBean = null, $additionalValues = null, array $additionalBeans = []): string
    {
        $templateCompiler = new Compiler($this);
        $templateCompiler->idsOfParentTemplates = array_merge($this->idsOfParentTemplates, [$this->id]);
        $html = $templateCompiler->compile($this->$field, $parentBean, $this->language, $additionalValues, $additionalBeans);
        return html_entity_decode($html);
    }
}

