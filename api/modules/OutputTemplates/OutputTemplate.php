<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\OutputTemplates;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SpiceTemplateCompiler\Compiler;
use SpiceCRM\includes\SpiceUI\SpiceUIRESTHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

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
    public function setAdditonalValues($additonalValues){
        $this->additonalValues = $additonalValues;
    }

    /**
     * List of IDs of possible parent templates (to prevent recursions).
     * @var
     */
    public $idsOfParentTemplates = [];

    public $useFrontendStylesheet = false;

    public function translateBody($bean = null, $bodyOnly = false)
    {
        if(!$bean)
        {
            if(!$this->bean)
                $this->retrieveBean();

            $bean = $this->bean;
        }
        if(!$bean)
            throw new Exception("No Bean found, translation aborted!");

        $templateCompiler = new Compiler($this);
        $templateCompiler->idsOfParentTemplates = array_merge( $this->idsOfParentTemplates, [$this->id] );
        if ($bodyOnly) {
            $html = $templateCompiler->compile(html_entity_decode( $this->body), $bean, $this->language, $this->additonalValues);
        } else {
            $html = $templateCompiler->compile('
                <body>
                    <header id="spice_page_header">
                        '.html_entity_decode( $this->header ).'
                    </header>
                    <main>
                            '.html_entity_decode( $this->body ).'
                    </main>
                    <footer id="spice_page_footer">
                            '.html_entity_decode( $this->footer ).'
                    </footer>
                    </body>', $bean, $this->language, $this->additonalValues);
            $html = preg_replace('#^<html>#s', '<html>
                <head>
                    <style>
                        '.$this->getStyle().'
                    </style>
                </head>
            ', $html );
        }

        return $html;
    }

    public function __toString()
    {
        return $this->translateBody();
    }

    private function setPDFHandler(){
        if ( $this->pdf_handler ) return; // PDF handler already set, nothing to do
        $class = @SpiceConfig::getInstance()->config['outputtemplates']['pdf_handler_class'];
        if(!$class) $class = '\SpiceCRM\modules\OutputTemplates\handlers\pdf\DomPdfHandler';
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

    public function getFileName()
    {
        return "{$this->module_name}_{$this->name}.pdf";
    }

    public function getPdfContent()
    {
        $this->setPDFHandler();
        return $this->pdf_handler->__toString();
    }

    public function setOutputHtml( $html ) {
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
        if ( $this->useFrontendStylesheet ) return $this->getFrontendStylesheet();
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
        if ( is_readable( $filepath )) $css .= file_get_contents( $filepath )."\n";

        // second the custom stylesheet, if available
        $filepath = '../config/assets/css/spicecrm.css';
        if ( is_readable( $filepath )) $css .= file_get_contents( $filepath )."\n";

        // at last last the CI colors/styles from the assets table
        $assets = ( new SpiceUIRESTHandler() )->getAssets();
        foreach ( $assets as $asset ) {
            if ( $asset['assetkey'] === 'colors' ) {
                $dummy = json_decode( $asset['assetvalue'] );
                foreach ( $dummy as $k => $v ) {
                    $css .= '--'.$k.':'.$v.';';
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
