<?php
namespace SpiceCRM\modules\OutputTemplates\handlers\pdf;

use Dompdf\Dompdf;
use Dompdf\Options;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 *  Attention: this class is not finished yet... nor tested...
 * wiki: https://github.com/dompdf/dompdf/wiki/Usage
 * Class TcpdfHandler
 */
class DomPdfHandler extends LibPdfHandler
{

    protected $class_instance;

    protected function createInstance()
    {
        $options = new Options();
        $options->set('isRemoteEnabled', true);

        // set cache folder for dompdf fonts
        $options->setFontDir($this->getFontDirCacheFolder());
        $options->setFontCache($this->getFontCacheCacheFolder());

        $dompdf = new Dompdf($options);
        $contxt = stream_context_create([
            'ssl' => [
                'verify_peer' => FALSE,
                'verify_peer_name' => FALSE,
                'allow_self_signed'=> TRUE
            ]
        ]);
        $dompdf->setHttpContext($contxt);
        return $dompdf;
    }

    /**
     * return real path for dompdf cache fonts directory
     * @return string
     */
    public function getFontDirCacheFolder(){
        $rootDir = realpath(__DIR__ . "/../../../../");
        $fontDir = isset(SpiceConfig::getInstance()->config['dompdf']['fontDir']) ? SpiceConfig::getInstance()->config['dompdf']['fontDir'] : 'dompdf/fonts/';
        return $rootDir.'/'.create_cache_directory($fontDir);
    }

    /**
     * return real path for dompdf cache fonts directory
     * @return string
     */
    public function getFontCacheCacheFolder(){
        $rootDir = realpath(__DIR__ . "/../../../../");
        $fontCache = isset(SpiceConfig::getInstance()->config['dompdf']['fontCache']) ? SpiceConfig::getInstance()->config['dompdf']['fontCache'] : 'dompdf/lib/fonts/';
        return $rootDir.'/'.create_cache_directory($fontCache);
    }


    public function process($html = null, array $options = null)
    {
        parent::process($html, $options);

        $this->createDomPdf($this->html_content, $this->options);
        return true;
    }

    private function createDomPdf($html, $options = null)
    {
        $options = (object) $options;

        $this->class_instance->loadHtml($html);

        // set page format
        $this->class_instance->setPaper($this->template->page_size ?: 'A4', $this->template->page_orientation == 'L' ? 'landscape' : 'portrait');

        // set DPI
        // $this->class_instance->set_option( 'dpi', 300 );

        // render the PDF
        $this->class_instance->render();
        $this->content = $this->class_instance->output();
        //var_dump($html); exit;
        return $this->class_instance;
    }

    public function toDownload($file_name = null)
    {
        if(!$file_name)
            $file_name = $this->template->getFileName();

        if(!$this->content)
            $this->process();

        return $this->class_instance->stream($file_name);
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
