<?php

/*
 * This File is part of KREST is a Restful service extension for SugarCRM
 * 
 * Copyright (C) 2015 AAC SERVICES K.S., DOSTOJEVSKÉHO RAD 5, 811 09 BRATISLAVA, SLOVAKIA
 * 
 * you can contat us at info@spicecrm.io
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */

namespace SpiceCRM\includes\utils\api\controllers;


use Imagick;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;

class UtilsController
{

    /**
     * convert a pdf to a base64 image
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     */

    public function RestPDFToBaseImage( Request $req, Response $res, $args ): Response {
        $RESTUtilsHandler = new UtilsController();
        $data = $RESTUtilsHandler->pdfToBase64Image($args['filepath']);
        return $res->withJson($data);
    }

    /**
     * converts a pdf to Url image
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function RestPDFToUrlImage( Request $req, Response $res, $args ): Response {
        $RESTUtilsHandler = new UtilsController();
        $urls = $RESTUtilsHandler->pdfToUrlImage($args['filepath']);
        return $res->withJson($urls);
    }

    /**
     * Puts the content to a temppath
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function PutToTmpPdfPath( Request $req, Response $res, $args ): Response {
        $postBody = $req->getParsedBody();
        $temppath = sys_get_temp_dir();
        $filename = SpiceUtils::createGuid() . '.pdf';
        file_put_contents($temppath . '/' . $filename, base64_decode($postBody));
        return $res->withJson($temppath . '/' . $filename);
    }

    /**
     * puts the content to an upload path
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function PutToUpPath( Request $req, Response $res, $args ): Response {
        $postBody = $req->getParsedBody();
        $filename = SpiceUtils::createGuid() . '.pdf';
        file_put_contents(SpiceConfig::getInstance()->config['upload_dir'] . $filename, base64_decode($postBody));
        return $res->withJson(SpiceConfig::getInstance()->config['upload_dir'] . $filename);
    }

    public function pdfToUrlImage($filepath, $thumbnail = false)
    {
        
        $im = new Imagick();
        $im->setResolution(300, 300);
        $im->readImage($filepath);
        $count = $im->getNumberImages();
        $urls = [];
        for ($x = 1; $x <= $count; $x++) {
            $pageindex = $x - 1;
            $im->readImage($filepath . "[" . $pageindex . "]");
            $im = $im->flattenImages();
            if ($thumbnail) {
                $im->thumbnailImage(400, null);
            }
            $im->setImageFormat('jpeg');
            $im->writeImage(SpiceConfig::getInstance()->config['upload_dir'] . basename($filepath) . '_' . $x . '.pdf');
            $urls[] = SpiceConfig::getInstance()->config['upload_dir'] . basename($filepath, '_' . $x . '.pdf');
        }

        return $urls;
    }

    public function pdfToBase64Image($filepath, $thumbnail = false)
    {
        $im = new Imagick();
        $im->setResolution(300, 300);
        $im->readImage($filepath);
        $count = $im->getNumberImages();
        $data = [];
        for ($x = 1; $x <= $count; $x++) {
            $pageindex = $x - 1;
            $im->readImage($filepath . "[" . $pageindex . "]");
            $im = $im->flattenImages();
            if ($thumbnail) {
                $im->thumbnailImage(400, null);
            }
            $im->setImageFormat('jpeg');
            $data[] = base64_encode($im->getImageBlob());
        }

        return $data;
    }
}
