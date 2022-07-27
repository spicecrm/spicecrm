<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\OutputTemplates\handlers\pdf;

use SpiceCRM\includes\ErrorHandlers\Exception;
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
                'margin-top: '.( $this->options['margin_top'] ?: '0' ).'; '.
                'margin-right: '.(  $this->options['margin_right'] ?: '0' ).'; '.
                'margin-bottom: '.( $this->options['margin_bottom'] ?: '0' ).'; '.
                'margin-left: '.( $this->options['margin_left'] ?: '0' ).'; '.
            '}'.
            '* { -webkit-print-color-adjust: exact; }';
    }

    public function createChromeLocalPdf()
    {
        $stylesheet = $this->template->getStyle();
        $stylesheet = preg_replace('/(background:#(.+?))(;|})/s', '\1!important\3', $stylesheet );
        $stylesheet = preg_replace('/(background-color:#(.+?))(;|})/s', '\1!important\3', $stylesheet );

        $htmlOutput = '<!DOCTYPE html><html><head><meta charset="utf-8" /><style>'.$this->getPageStyle().'</style>';
        $htmlOutput .= '<style>'.$stylesheet.'</style><style>html { font-size: '.$this->basicFontSize.'; }</style></head>'.$this->html_content.'</html>';

        do {
            $tmpHtmlFilename = tempnam(sys_get_temp_dir(), '');
        } while( !rename( $tmpHtmlFilename, $tmpHtmlFilename .= '.html'));
        file_put_contents($tmpHtmlFilename, $htmlOutput );
        $tmpPdfFilename = tempnam( sys_get_temp_dir(), '' );

        $chromePath = SpiceConfig::getInstance()->config['outputtemplates']['chrome_path'];
        # --run-all-compositor-stages-before-draw
        # --enable-logging
        exec( sprintf('%s --virtual-time-budget=10000 --headless --disable-gpu --print-to-pdf=%s --print-to-pdf-no-header --no-margins %s', escapeshellarg($chromePath), escapeshellarg($tmpPdfFilename), escapeshellarg($tmpHtmlFilename) ),$output,$resultCode );
        unlink( $tmpHtmlFilename );
        if ( $resultCode !== 0 ) {
            unlink($tmpPdfFilename);
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
