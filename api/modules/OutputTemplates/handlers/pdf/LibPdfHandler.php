<?php
namespace SpiceCRM\modules\OutputTemplates\handlers\pdf;

use SpiceCRM\modules\OutputTemplates\OutputTemplate;

abstract class LibPdfHandler extends PdfHandler
{
    protected $class_instance;

    public function __construct(OutputTemplate $template)
    {
        parent::__construct($template);
        $this->class_instance = $this->createInstance();
    }

    public function __toString()
    {
        if(!$this->content)
            $this->process();

        return parent::__toString();
    }

    // a callback function to instantiate the $class_instance, called right after parent __constract()
    abstract protected function createInstance();
}
