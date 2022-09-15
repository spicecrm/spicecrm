<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

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
        $this->createChromeLocalPdf();
    }

    public function getPageStyle() {
        return
            '@page { '.
                'size: ' . ( $this->options['page_size'] ?: 'A4' ) . ( $this->options['page_orientation'] === 'L' ? ' landscape' : ' portrait' ).'; '.
                'margin-top: '.( $this->options['margin_top'] ?: '0' ).'mm; '.
                'margin-right: '.(  $this->options['margin_right'] ?: '0' ).'mm; '.
                'margin-bottom: '.( $this->options['margin_bottom'] ?: '0' ).'mm; '.
                'margin-left: '.( $this->options['margin_left'] ?: '0' ).'mm; '.
            '}'.
            '* { -webkit-print-color-adjust: exact; }'.
            'html, body { padding: 0; margin: 0; }';
    }

    public function createChromeLocalPdf()
    {
        $stylesheet = $this->template->getStyle();

        $stylesheet = preg_replace('/(background:(.+?))(;|})/s', '\1!important\3', $stylesheet );
        $stylesheet = preg_replace('/(background-color:(.+?))(;|})/s', '\1!important\3', $stylesheet );

        $htmlBody = $this->html_content;

        # echo $this->html_content;  exit;

        if ( isset( $this->template->header[0] ) or isset( $this->template->footer[0] )) {
            $stylesheet .= "
                header, footer, table.header_footer_table { 
                    box-sizing: border-box;
                }
                table.header_footer_table {
                    border-spacing: 0; 
                    x-background-color: #ccf; /* for testing */
                } 
                header, footer {
                    display: block;
                    position: fixed;
                    width: auto;
                    page-break-before: avoid; /* hack for chrome */
                    x-background-color: gray; /* for testing */
                    x-opacity: 0.5; /* for testing */
                }
                header {
                    top: 0; left: 0; right: 0;
                    margin-top: 1px; /* optical hack */
                }
                footer { bottom: 0; left: 0; right: 0; }
                #header_cell, #footer_cell { height: 0; }
            ";
            $htmlBody = preg_replace('#<main>(.*?)</main>#s',
                '<table class="header_footer_table"><thead><tr><td id="header_cell"></td></tr></thead><tbody><tr><td><main>\1</main></td></tr></tbody><tfoot><tr><td id="footer_cell"></td></tr></tfoot></table>',
                $htmlBody, 1 );
        }

        $javascript = '<script>
            window.onload = function () {
                document.getElementById("header_cell").style.height = document.getElementById("page_header").offsetHeight+"px";
                // document.getElementById("header_cell").style.backgroundColor = "red"; // for testing
                // document.getElementById("header_cell").style.opacity = "0.5"; // for testing
                document.getElementById("footer_cell").style.height = document.getElementById("page_footer").offsetHeight+"px";
                // document.getElementById("footer_cell").style.backgroundColor = "green"; // for testing
                // document.getElementById("footer_cell").style.opacity = "0.5"; // for testing
            }
            </script>
        ';
        $htmlOutput = '<!DOCTYPE html><html><head><meta charset="utf-8" /><style>'.$this->getPageStyle().'</style>';
        $htmlOutput .= '<style>'.$stylesheet.'</style><style>html { font-size: '.$this->basicFontSize.'; }</style></head>'.$htmlBody.$javascript.'</html>';

        $htmlOutput = str_replace('<html><body>','<body>',$htmlOutput);
        $htmlOutput = str_replace('</body></html>','</body>',$htmlOutput);

        # echo $this->html_content;
        # echo $htmlOutput;
        # exit;

        do {
            $tmpHtmlFilename = tempnam(sys_get_temp_dir(), '');
        } while( !rename( $tmpHtmlFilename, $tmpHtmlFilename .= '.html'));
        file_put_contents($tmpHtmlFilename, $htmlOutput );
        $tmpPdfFilename = tempnam( sys_get_temp_dir(), '' );

        $chromePath = SpiceConfig::getInstance()->config['outputtemplates']['chrome_path'];
        # also available command line parameters of chrome, but not used:
        # --run-all-compositor-stages-before-draw
        # --enable-logging
        $counter = 0;
        do {
            if ( $counter !== 0 ) unlink( $tmpPdfFilename );
            $counter++;
            exec(sprintf('%s --virtual-time-budget=10000 --headless --disable-gpu --print-to-pdf=%s --print-to-pdf-no-header --no-margins %s', escapeshellarg($chromePath), escapeshellarg($tmpPdfFilename), escapeshellarg($tmpHtmlFilename)), $output, $resultCode);
            $fs = filesize( $tmpPdfFilename );
        } while ( $fs < 2000 and $counter < 10 );
        if ( $counter > 1 ) {
            if ( $counter === 10 and $fs < 2000 ) LoggerManager::getLogger()->fatal('ChromeLocalPdfHandler: Could not generate PDF successfully after 10 attempts (PDF size less than 2000 Bytes).');
            else LoggerManager::getLogger()->warn('ChromeLocalPdfHandler: Problems to generate PDF successfully (PDF size less than 2000 Bytes). Tried '.$counter.' times to succeed.');
        }
        unlink( $tmpHtmlFilename );
        if ( $resultCode !== 0 ) {
            unlink( $tmpPdfFilename );
            throw new Exception('Error generating PDF (with handler "chromelocal").');
        }

        $this->content = file_get_contents( $tmpPdfFilename );
        unlink( $tmpPdfFilename );
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
