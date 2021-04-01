<?php
namespace SpiceCRM\modules\OutputTemplates\handlers\pdf;

use SpiceCRM\includes\ErrorHandlers\Exception;

class RocketPdfHandler extends ApiPdfHandler
{
    public static $URL = 'http://api.html2pdfrocket.com/pdf';
    protected $access_data = [
        'key' => 'abada36d-531d-4872-8ab2-f2df8c50f844'
    ];

    public function process($html = null, array $options = null)
    {
        parent::process($html, $options);

        $curl = curl_init();
        curl_setopt_array(
            $curl,
            [
                CURLOPT_URL => static::$URL,
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_POST => 1,
                CURLOPT_POSTFIELDS => http_build_query(
                    [
                        'apikey' => $this->access_data['key'],
                        'value' => $this->html_content, // a url starting with http or an HTML string.  see example #5 if you have a long HTML string
                        'MarginTop' => $this->options['margin_top'] ?: 10,
                        'MarginBottom' => $this->options['margin_bottom'] ?: 10,
                        'MarginLeft' => $this->options['margin_left'] ?: 10,
                        'MarginRight' => $this->options['margin_right'] ?: 10,
                    ]
                ),
            ]
        );
        //var_dump($html); exit;
        $result = curl_exec($curl);
        if($result === false)
            throw new Exception(curl_error($curl));

        $this->content = $result;
        return true;
    }

}
