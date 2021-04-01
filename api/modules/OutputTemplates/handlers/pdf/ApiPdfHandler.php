<?php
namespace SpiceCRM\modules\OutputTemplates\handlers\pdf;

abstract class ApiPdfHandler extends PdfHandler
{
    public static $URL = '';
    protected $access_data = [];

    //todo: method to load $access_data from configs...

    public function toFile($destination_path, $file_name = null)
    {
        if(!$this->content)
            $this->process();

        if(!$file_name)
            $filename = md5($this->content).'.pdf';

        if(!file_put_contents($destination_path.'/'.$filename, $this->content))
            throw new \Exception("Could not save file to $destination_path/$filename!");

        return ['name' => $filename, 'path' => $destination_path, 'mime_type' => 'application/pdf'];
    }

    public function toDownload($file_name = null)
    {
        if(!$this->content)
            $this->process();

        //todo: set some headers to force a download...?

        return $this->content;
    }
}