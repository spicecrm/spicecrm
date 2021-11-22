<?php
namespace SpiceCRM\modules\OutputTemplates\handlers\pdf;

use Pdfcrowd\HtmlToPdfClient;

require_once('vendor/pdfcrowd/pdfcrowd.php');

class PdfCrowdHandler extends ApiPdfHandler
{
    protected $access_data = [
        'user_name' => 'twentyreasons',
        'api_key' => '0d206136e419b0bb29a7cc96816442be'
    ];

    public function process($html = null, array $options = null)
    {
        parent::process($html, $options);

        $client = new HtmlToPdfClient($this->access_data['user_name'], $this->access_data['api_key']);
        $client->setUseHttp(true);
        $this->content = $client->convertString($html);
        return true;
    }

}