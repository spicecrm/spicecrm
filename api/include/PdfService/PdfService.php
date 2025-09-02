<?php

namespace SpiceCRM\includes\PdfService;

use \SpiceCRM\modules\OutputTemplates\handlers\pdf\ChromeLocalPdfHandler;

class PdfService
{

    public static function getPdfDocument( $html )
    {
        return ChromeLocalPdfHandler::createPdf( $html );
    }

}