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

namespace SpiceCRM\modules\OutputTemplates\handlers\pdf;

use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class ChromeLocalPdfHandler extends PdfHandler
{
    public $basicFontSize = '9pt';

    public function process( $html = null, array $options = null )
    {
        parent::process( $html, $options );
        if ( get_class( $this ) === 'SpiceCRM\modules\OutputTemplates\handlers\pdf\ChromeLocalPdfHandler' ) $this->createChromeLocalPdf();
    }

    /**
     * Creates the CSS code google chrome needs to know for rendering the pdf file, using the parameters of the output template.
     * @return string The CSS Code
     */
    public function getPageStyle() {
        return '@page { 
                    size: ' . ( $this->options['page_size'] ?: 'A4' ) . ( $this->options['page_orientation'] === 'L' ? ' landscape' : ' portrait' ).';
                    margin-top: '.( $this->options['margin_top'] ?: '0' ).'mm;
                    margin-right: '.(  $this->options['margin_right'] ?: '0' ).'mm;
                    margin-bottom: '.( $this->options['margin_bottom'] ?: '0' ).'mm;
                    margin-left: '.( $this->options['margin_left'] ?: '0' ).'mm;
                }
            ';
    }

    /**
     * Take the content (HTML) and create a PDF.
     * @return void
     */
    public function createChromeLocalPdf()
    {
        $this->htmlOfPdfCreation = $this->createHtmlForPdf( $this->html_content );
        $this->content = self::createPdf( $this->htmlOfPdfCreation );
    }

    /**
     * Create the HTML code needed by Google Chrome to generate the PDF document.
     * @param $htmlInput The HTML code of the content.
     * @return string The HTML code for Google Chrome.
     */
    public function createHtmlForPdf( $htmlInput )
    {
        $htmlOutput = $htmlInput;

        # Chrome needs for some css (background and background-color) a specific treatment:
        $htmlOutput = preg_replace_callback('#<style>(.*?)</style>#s', function ( $match ) {
            $styleElement = $match[0];
            $styleElement = preg_replace('/(background:(.+?))(;|})/s', '\1!important\3', $styleElement );
            $styleElement = preg_replace('/(background-color:(.+?))(;|})/s', '\1!important\3', $styleElement );
            return $styleElement;
        }, $htmlOutput );

        $htmlOutput = '<!DOCTYPE html>'.$htmlOutput;

        if ( isset( $this->template->header[0] ) or isset( $this->template->footer[0] )) {
            $stylesheetHeaderFooter = "
                <style>
                    #header_cell, #footer_cell, td.header_cell, td.footer_cell { 
                        box-sizing: border-box;
                    }
                    table.header_footer_table {
                        border-spacing: 0;
                        /* for testing: */
                        /* 
                        background-color: #ccf; 
                        */
                    } 
                    header, footer {
                        display: block;
                        position: fixed;
                        width: auto;
                        page-break-before: avoid; /* hack for chrome */
                        /* for testing: */
                        /*
                        background-color: gray;
                        opacity: 0.5; 
                        */
                    }
                    header {
                        top: 0; left: 0; right: 0;
                        margin-top: 1px; /* optical hack */
                    }
                    footer { bottom: 0; left: 0; right: 0; }
                    #header_cell, #footer_cell { height: 0; }
                </style>
            ";

            # Insert layout table, necessary for header and/or footer:
            $htmlOutput = preg_replace('#<main>(.*?)</main>#s', '
                <table class="header_footer_table">
                    <thead><tr>
                        <td id="header_cell"></td>
                    </tr></thead>
                    <tbody><tr>
                        <td><main>\1</main></td>
                    </tr></tbody>
                    <tfoot><tr>
                        <td id="footer_cell"></td>
                    </tr></tfoot>
                </table>
            ', $htmlOutput, 1 );
        }

        # Javascript, necessary for setting header/footer cell height, by measured header/footer height:
        $handlerSpecificJavascript = '
            <script>
                window.onload = function () {
                    document.getElementById("header_cell").style.height = (document.getElementById("spice_page_header").offsetHeight + 10)+"px";
                    // document.getElementById("header_cell").style.backgroundColor = "red"; // for testing
                    // document.getElementById("header_cell").style.opacity = "0.5"; // for testing
                    document.getElementById("footer_cell").style.height = (document.getElementById("spice_page_footer").offsetHeight + 10)+"px";
                    // document.getElementById("footer_cell").style.backgroundColor = "green"; // for testing
                    // document.getElementById("footer_cell").style.opacity = "0.5"; // for testing
                }
            </script>
        ';

        $handlerSpecificHead = '
            <meta charset="utf-8" />
            <style>'.$this->getPageStyle().'</style>
            <style>
                * { -webkit-print-color-adjust: exact; }
                html, body { padding: 0; margin: 0; }
                html { font-size: '.$this->basicFontSize.'; }
            </style>
            '.$stylesheetHeaderFooter.'
        ';

        # Insert handler specific head elements (styles):
        $htmlOutput = preg_replace('#<head>#s', '<head>'.$handlerSpecificHead, $htmlOutput );

        # Insert handler specific javascript at the end of the document:
        $htmlOutput = preg_replace('#</html>$#s', $handlerSpecificJavascript.'</html>', $htmlOutput );

        # for testing:
        # echo $htmlOutput; exit;

        return $htmlOutput;
    }

    /**
     * Take the HTML Code and let Google Chrome generate the PDF file.
     * @param $htmlOutput
     * @return string The content of the generated PDF file.
     */
    public static function createPdf( $htmlOutput ) {

        # Create temporary html file, get name for temporary pdf file:
        do {
            $tmpHtmlFilename = tempnam(sys_get_temp_dir(), '');
        } while( !rename( $tmpHtmlFilename, $tmpHtmlFilename .= '.html'));
        file_put_contents( $tmpHtmlFilename, $htmlOutput );
        $tmpPdfFilename = tempnam( sys_get_temp_dir(), '' );

        $chromePath = SpiceConfig::getInstance()->config['outputtemplates']['chrome_path'];
        # also available command line parameters of chrome, but not used:
        # --run-all-compositor-stages-before-draw
        # --enable-logging
        #
        # Sometimes Chrome creates an empty pdf file. In this case try to create the file again, up to 10 times:
        $counter = 0;
        do {
            if ( $counter !== 0 ) unlink( $tmpPdfFilename );
            $counter++;
            exec( sprintf('%s --virtual-time-budget=10000 --headless --disable-gpu --print-to-pdf=%s --print-to-pdf-no-header --no-margins %s', escapeshellarg($chromePath), escapeshellarg($tmpPdfFilename), escapeshellarg($tmpHtmlFilename)), $output, $resultCode );
            $fs = filesize( $tmpPdfFilename );
        } while ( $fs < 2000 and $counter < 10 );
        if ( $counter > 1 ) {
            if ( $counter === 10 and $fs < 2000 ) LoggerManager::getLogger()->fatal('chromepdf', 'ChromeLocalPdfHandler: Could not generate PDF successfully after 10 attempts (PDF size less than 2000 Bytes).');
            else LoggerManager::getLogger()->warn('chromepdf', 'ChromeLocalPdfHandler: Problems to generate PDF successfully (PDF size less than 2000 Bytes). Tried '.$counter.' times to succeed.');
        }
        unlink( $tmpHtmlFilename );

        # in case there was an error generating the pdf file:
        if ( $resultCode !== 0 ) {
            unlink( $tmpPdfFilename );
            throw new Exception('Error generating PDF (with handler "chromelocal").');
        }

        $pdfContent = file_get_contents( $tmpPdfFilename );
        unlink( $tmpPdfFilename );

        return $pdfContent;
    }

    public function toDownload($file_name = null)
    {
        if ( !$this->content ) $this->process();
        return $this->content;
    }

    public function toFile($destination_path, $file_name = null)
    {
        if(!$file_name)
            $filename = $this->id.'.pdf';

        if(!$this->content)
            $this->process();

        if(!file_put_contents("$destination_path/$filename", $this->content))
            throw new Exception("Could not save file to $destination_path/$filename!");

        return ['name' => $filename, 'path' => $destination_path, 'mime_type' => 'application/pdf'];
    }
}
