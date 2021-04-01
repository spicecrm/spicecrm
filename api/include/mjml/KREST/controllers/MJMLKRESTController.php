<?php


namespace SpiceCRM\includes\mjml\KREST\controllers;

use Exception;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class MJMLKRESTController
{
    /**
     * loaded from \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['mjml']['url']
     * @var string
     */
    protected $url = "https://api.mjml.io/v1/render";
    /**
     * loaded from \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['mjml']['appId']
     * @var string
     */
    protected $appId = "16612633-1d7b-4aec-a102-4fd4dd0ee9da";
    /**
     * loaded from \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['mjml']['secretKey']
     * @var string
     */
    protected $secretKey = "551a8c83-78a0-420b-b0ad-a41e7bf4a563";

    public function __construct()
    {
        
        if (!SpiceConfig::getInstance()->config['mjml'] || empty(SpiceConfig::getInstance()->config['mjml'])) return;
        $this->url = SpiceConfig::getInstance()->config['mjml']['url'];
        $this->appId = SpiceConfig::getInstance()->config['mjml']['appId'];
        $this->secretKey = SpiceConfig::getInstance()->config['mjml']['secretKey'];
    }

    /**
     * parse json to html by the mjml api
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function parseJsonToHtml($req, $res, $args)
    {
        $json = $req->getParsedBody()['json'];
        if (!$json) {
            throw new Exception('Json format is incorrect', '400');
        }
        $xml = addslashes($this->json2xml($json));
        return $res->withJson($this->xmlToHtml($xml));
    }

    /**
     * convert mjml xml to html
     * @param $xml
     * @return string
     */
    private function xmlToHtml($xml)
    {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => $this->url,
            CURLOPT_POST           => 1,
            CURLOPT_POSTFIELDS     => '{"mjml":"'.$xml.'"}',
            CURLOPT_HEADER         => 1,
            CURLOPT_HTTPHEADER     => [
                'Content-Type:application/json',
                'Authorization: Basic ' . base64_encode("$this->appId:$this->secretKey")
            ]
        ]);
        $response = curl_exec($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);
        $response = json_decode(substr($response, $info['header_size']));
        if ($info['http_code'] != 200) return ['html' => false, 'message' => $response->message];
        return ['html' => $response->html];
    }

    /**
     * convert mjml json structure to mjml xml
     * @param $node
     * @param string $prefix
     * @return string
     */
    public function json2xml($node, $prefix = '')
    {
        $tagName = isset($node['tagName']) ? $node['tagName'] : null;
        $children = isset($node['children']) ? $node['children'] : null;
        $content = isset($node['content']) ? $node['content'] : null;
        $attributes = isset($node['attributes']) ? $node['attributes'] : null;

        $attributes = $attributes ? ' ' . $this->lineAttributes($attributes) : '';

        $inside = '';

        if ($content) {
            $inside = $tagName != 'raw' ? $content : '<div style="font-size: initial;">'. preg_replace('/[\r\n]/', '',$content) .'</div>';
        } elseif ($children) {
            $inside = join(array_map(function ($child) {
                    return $this->json2xml($child, 'mj-');
                }, $children));
        }

        return "<$prefix$tagName$attributes>$inside</$prefix$tagName>";
    }

    /**
     * Convert attributes array to xml style attributes
     *
     * @param array $attributes
     *
     * @return string
     */
    protected function lineAttributes($attributes)
    {
        $res = '';

        foreach ($attributes as $key => $value) {
            $res .= $key . '="' . $value . '" ';
        }

        return trim($res);
    }
}
