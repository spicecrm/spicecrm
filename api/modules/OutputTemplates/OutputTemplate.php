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

namespace SpiceCRM\modules\OutputTemplates;

use DateTime;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SpiceTemplateCompiler\Compiler;
use SpiceCRM\includes\SpiceUI\SpiceUIRESTHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;

class OutputTemplate extends SpiceBean
{

    // fields which holds options to create pdfs
    public static $PDF_OPTION_FIELDS = [
        'page_size',
        'page_orientation',
        'margin_left',
        'margin_top',
        'margin_right',
        'margin_bottom'
    ];

    /**
     * the loaded PDF handler Class
     *
     * @var
     */
    private $pdf_handler;

    /**
     * hold potential additonal values
     *
     * @var array
     */
    private $additonalValues = [];

    /**
     * an be called to set an array or object with different values to be
     *
     * @param $additonalValues an stdclass object
     */
    public function setAdditonalValues($additonalValues)
    {
        $this->additonalValues = $additonalValues;
    }

    /**
     * List of IDs of possible parent templates (to prevent recursions).
     * @var
     */
    public $idsOfParentTemplates = [];

    public $useFrontendStylesheet = false;

    public $filename;

    /**
     * the ID of the bean to be used as paren
     * @var
     */
    public $bean_id;

    /**
     * if not the id is set the bean can be set alternatively.
     *
     * @var
     */
    public $bean;

    public function translateBody($bean = null, $bodyOnly = false)
    {
        if (!$bean) {

            if(!$this->bean || $this->bean->id != $this->bean_id) {
                $this->retrieveBean();
            }

            $bean = $this->bean;
        }

        if (!$bean)
            throw new Exception("No Bean found, translation aborted!");

        $templateCompiler = new Compiler($this);
        $templateCompiler->idsOfParentTemplates = array_merge($this->idsOfParentTemplates, [$this->id]);
        if ($bodyOnly) {
            $html = $templateCompiler->compile(html_entity_decode($this->body), $bean, $this->language, $this->additonalValues);
        } else {
            $html = $templateCompiler->compile('
                <body>
                    <header id="spice_page_header">
                        ' . html_entity_decode($this->header) . '
                    </header>
                    <main>
                            ' . html_entity_decode($this->body) . '
                    </main>
                    <footer id="spice_page_footer">
                            ' . html_entity_decode($this->footer) . '
                    </footer>
                    </body>', $bean, $this->language, $this->additonalValues);
            $html = preg_replace('#^<html>#s', '<html>
                <head>
                    <style>
                        ' . $this->getStyle() . '
                    </style>
                </head>
            ', $html);
        }

        // if we have a public name -> parse it as well
        if ($this->public_name) {
            $this->public_name = str_replace(["\n", "\n"], "", strip_tags($this->parseHTMLTextField('public_name', $bean, $this->additonalValues)));
        }


        return $html;
    }

    /**
     * parse html content
     * @param $bean
     * @param $additionalValues
     * @param $additionalBeans
     * @return array|string|string[]|null
     */
    function parse($bean, $field = 'body_html', $additionalValues = null, $additionalBeans = [])
    {

        global $app_list_strings;

        $app_list_strings = SpiceUtils::returnAppListStringsLanguage($this->language);

        // if we have a public name -> parse it
        if ($this->public_name) {
            $this->public_name = $this->parseHTMLTextField('public_name', $bean, $additionalValues, $additionalBeans);
        }

        return preg_replace(
            '#^<html>#', '<html><head><style>' . $this->getStyle() . '</style></head>',
            $this->parseHTMLTextField($field, $bean, $additionalValues, $additionalBeans)
        );
    }

    /**
     * parse html text field
     * @param $field
     * @param $parentbean
     * @param $additionalValues
     * @param $additionalBeans
     * @return string
     */
    public function parseHTMLTextField($field, $parentbean = null, $additionalValues = null, $additionalBeans = [])
    {
        $templateCompiler = new Compiler($this);
        $templateCompiler->idsOfParentTemplates = array_merge($this->idsOfParentTemplates, [$this->id]);
        $html = $templateCompiler->compile($this->$field, $parentbean, $this->language, $additionalValues, $additionalBeans);
        return html_entity_decode($html);
    }

    public function __toString()
    {
        return $this->translateBody();
    }

    private function setPDFHandler()
    {
        $class = @SpiceConfig::getInstance()->config['outputtemplates']['pdf_handler_class'];
        if (!$class) $class = '\SpiceCRM\modules\OutputTemplates\handlers\pdf\DomPdfHandler';
        $this->pdf_handler = new $class($this);
    }

    public function download()
    {
        $this->setPDFHandler();
        return $this->pdf_handler->toDownload();
    }

    private function saveAsTmpFile($filename = null)
    {
        $this->setPDFHandler();
        return $this->pdf_handler->toTempFile($filename);
    }

    /**
     * returns a filen ame for the generated PDF
     *
     * @return array|string|string[]
     */
    public function getFileName()
    {
        // if a public name is set .. use it
        if($this->public_name) return "{$this->public_name}.pdf";

        // load the bean if it is not laoded
        if (!$this->bean) $this->retrieveBean();

        // generate a generic filename
        $date = (new DateTime())->format('Y-m-d_His');
        $summary = $this->bean->get_summary_text();
        return "{$summary}_{$date}.pdf";
    }

    public function getPdfContent()
    {
        $this->setPDFHandler();
        return $this->pdf_handler->__toString();
    }

    public function setOutputHtml($html)
    {
        $this->setPDFHandler();
        $this->pdf_handler->html_content = $html;
    }

    public function convertToSpiceAttatchment()
    {
        $file = $this->saveAsTmpFile();
        return SpiceAttachments::saveAttachmentLocalFile($this->module_name, $this->bean_id, $file);
    }

    private function retrieveBean()
    {
        if ($this->bean_id) {
            $this->bean = BeanFactory::getBean($this->module_name, $this->bean_id);
        }

        return $this->bean;
    }

    public function getStyle(): string
    {
        if ($this->useFrontendStylesheet) return $this->getFrontendStylesheet();
        $style = '';
        if (!empty($this->stylesheet_id)) {
            $styleRecord = $this->db->fetchByAssoc($this->db->query("SELECT csscode FROM sysuihtmlstylesheets WHERE id='{$this->stylesheet_id}'"));
            $style = html_entity_decode($styleRecord['csscode'], ENT_QUOTES);
        }
        return str_replace(["\n", "\t"], "", $style);
    }

    /**
     * Gets the stylesheet of the SpiceCRM frontend
     */
    public static function getFrontendStylesheet(): string
    {
        $css = '';

        // first the stylesheet of the core
        $filepath = '../app/styles.css';
        if (is_readable($filepath)) $css .= file_get_contents($filepath) . "\n";

        // second the custom stylesheet, if available
        $filepath = '../config/assets/css/spicecrm.css';
        if (is_readable($filepath)) $css .= file_get_contents($filepath) . "\n";

        // at last last the CI colors/styles from the assets table
        $assets = (new SpiceUIRESTHandler())->getAssets();
        foreach ($assets as $asset) {
            if ($asset['assetkey'] === 'colors') {
                $dummy = json_decode($asset['assetvalue']);
                foreach ($dummy as $k => $v) {
                    $css .= '--' . $k . ':' . $v . ';';
                }
            }
        }
        return $css;
    }

    /**
     * Gets the HTML code the PDF document is based on. For debugging the template.
     *
     * @return string the HTML code
     */
    public function getHtmlOfPdfCreation(): string
    {
        return $this->pdf_handler->htmlOfPdfCreation;
    }
}
