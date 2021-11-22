<?php
namespace SpiceCRM\modules\OutputTemplates\handlers\pdf;

use TCPDF;

require_once 'vendor/tcpdf6/tcpdf.php';

/**
 * Attention: it is not recommended to use this class with css... only very little support of it!
 * Class TcpdfHandler
 */
class TcpdfHandler extends LibPdfHandler
{
    protected function createInstance()
    {
        return new TCPDF();
    }

    public function process($html = null, array $options = null)
    {
        parent::process($html, $options);

        $this->createTcpdf($this->html_content, $this->options);
        return true;
    }

    private function createTcpdf($html = null, array $options = null)
    {
        $options = (object) $options;
        $this->class_instance->setPrintHeader(false);
        $this->class_instance->setPrintFooter(false);
        $this->class_instance->SetMargins($options->margin_left ?: 10, $options->margin_top ?: 10, $options->margin_right ?: 10, true);
        $this->class_instance->SetAutoPageBreak(true, 10);
        $this->class_instance->AddPage($options->page_orientation, $options->page_size);
        $this->class_instance->writeHTML($html);
        $this->content = $this->class_instance->Output('', 'S');
        return $this->class_instance;
    }

    public function toDownload($file_name = null)
    {
        if(!$file_name)
            $file_name = $this->template->getFileName();

        if(!$this->content)
            $this->process();

        return $this->class_instance->Output($file_name, 'D');
    }

    public function toFile($destination_path, $file_name = null)
    {
        if(!$file_name)
            $filename = $this->id.'.pdf';

        if(!$this->content)
            $this->process();

        if(!$this->class_instance->Output($destination_path.'/'.$filename, 'F'))
            throw new Exception("Could not save file to $destination_path/$filename!");

        return ['name' => $filename, 'path' => $destination_path, 'mime_type' => 'application/pdf'];
    }

}