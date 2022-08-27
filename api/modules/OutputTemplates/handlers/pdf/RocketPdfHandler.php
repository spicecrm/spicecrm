<?php
/*********************************************************************************
 * This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
 * and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 * You can contact us at info@spicecrm.io
 *
 * SpiceCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 *
 * SpiceCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/

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
