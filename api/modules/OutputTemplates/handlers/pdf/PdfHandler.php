<?php
namespace SpiceCRM\modules\OutputTemplates\handlers\pdf;

use SpiceCRM\modules\OutputTemplates\OutputTemplate;

abstract class PdfHandler
{
    public $html_content = '';
    protected $options = [];
    protected $content = '';
    protected $template;

    public function __construct(OutputTemplate $template)
    {
        $this->template = $template;
    }

    public function __toString()
    {
        if(!$this->content)
            $this->process();

        return $this->content;
    }

    public function process($html = null, array $options = null)
    {
        if($html)
            $this->html_content = $html;
        if(!$html && !$this->html_content)
            $this->html_content = $this->template->translateBody();

        if(!$this->html_content)
            return false;

        $this->options = (array) $this->getOptions() + (array) $options;
    }

    public function getOptions()
    {
        return static::getTemplateOptions($this->template);
    }

    public static function getTemplateOptions(OutputTemplate $template)
    {
        $arr = [];
        foreach($template->PDF_FIELD_OPTIONS as $option)
        {
            $arr[$option] = $template->$option;
        }
        return $arr;
    }

    public abstract function toDownload($file_name = null);

    public abstract function toFile($destination_path, $file_name = null);

    public function toTempFile($file_name = null)
    {
        return $this->toFile(sys_get_temp_dir(), $file_name);
    }
}
