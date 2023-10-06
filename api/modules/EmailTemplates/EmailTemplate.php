<?php
namespace SpiceCRM\modules\EmailTemplates;

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

// EmailTemplate is used to store email email_template information.
class EmailTemplate extends SpiceBean {

    /**
     * List of IDs of possible parent templates (to prevent recursions).
     * @var
     */
    public $idsOfParentTemplates = [];

	function __construct() {
		parent::__construct();
	}


    function parse( $bean, $additionalValues = null, $additionalBeans = [] ){
        global $app_list_strings;
        $app_list_strings = SpiceUtils::returnAppListStringsLanguage($this->language);

        $pdfFiles = $this->generatePdfFilesFromOutputTemplates($bean);

        $retArray = [
            'subject' => $this->parsePlainTextField('subject', $bean, $additionalValues ),
            'body' => $this->parseHTMLTextField('body', $bean, $additionalValues, $additionalBeans ),
            'body_html' => $this->parseHTMLTextField('body_html', $bean, $additionalValues, $additionalBeans ),
            'attachments' => array_merge($this->getAttachmentsWithFiles(), $pdfFiles)
        ];

        $retArray['subject'] = preg_replace('#\s+#', ' ', $retArray['subject'] ); // multiple white spaces -> one
        return $this->callContentMethod($retArray);
    }

    /**
     * get attachments with files
     * @return array|false|string
     * @throws NotFoundException
     */
    private function getAttachmentsWithFiles()
    {
        $attachments = SpiceAttachments::getAttachmentsForBean('EmailTemplates', $this->id, 25, false);
        foreach ($attachments as &$attachment) {
            $attachmentWithFile = SpiceAttachments::getAttachment($attachment['id'], false);
            $attachment['file'] = $attachmentWithFile['file'];
        }

        return $attachments;
    }

    /**
     * generate pdf files from output templates
     * @param ?SpiceBean $bean
     * @return array
     */
    private function generatePdfFilesFromOutputTemplates(?SpiceBean $bean): array
    {
        if (!$bean) return [];

        $outputTemplates = $this->get_linked_beans('outputtemplates');

        $attachments = [];

        foreach ($outputTemplates as $outputTemplate) {

            if ($bean->_module != $outputTemplate->module_name) continue;

            $outputTemplate->bean_id = $bean->id;

            $fileContent = base64_encode($outputTemplate->getPdfContent());

            $attachments[] = [
                'file' => $fileContent,
                'file_mime_type' => 'application/pdf',
                'filename' => $outputTemplate->name . '.pdf',
                'filesize' => strlen($fileContent),
            ];
        }

        return $attachments;
    }

    /**
     * call the content method and return the adjusted html content by the method
     * @param string $html
     * @return mixed
     */
    private function callContentMethod(array $retArray)
    {
        if (empty($this->content_method)) return $retArray;

        $classMethod = SpiceUtils::loadExecutionClassMethod($this->content_method);

        if (!$classMethod) return $retArray;

        return $classMethod->class->{$classMethod->method}($this, $retArray);
    }


    public function parseHTMLTextField( $field, $parentbean = null, $additionalValues = null, $additionalBeans = [] )
    {
        $templateCompiler = new Compiler($this);
        $templateCompiler->idsOfParentTemplates = array_merge( $this->idsOfParentTemplates, [$this->id] );
        $html = $templateCompiler->compile($this->$field, $parentbean, $this->language, $additionalValues, $additionalBeans, $this->style);
        return html_entity_decode($html);
    }

    public function parsePlainTextField($field, $parentbean = null, $additionalValues = null )
    {
        $templateCompiler = new Compiler($this);
        $templateCompiler->idsOfParentTemplates = array_merge( $this->idsOfParentTemplates, [$this->id] );
        $templateCompiler->additionalValues = $additionalValues;
        $text = $templateCompiler->compileblock($this->$field, [ 'bean' => $parentbean ], $this->language );
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

