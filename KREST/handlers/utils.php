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

class KRESTUtilsHandler
{

    public function pdfToUrlImage($filepath, $thumbnail = false)
    {
        global $sugar_config;
        $im = new Imagick();
        $im->setResolution(300, 300);
        $im->readImage($filepath);
        $count = $im->getNumberImages();
        $urls = array();
        for ($x = 1; $x <= $count; $x++) {
            $pageindex = $x - 1;
            $im->readImage($filepath . "[" . $pageindex . "]");
            $im = $im->flattenImages();
            if ($thumbnail) {
                $im->thumbnailImage(400, null);
            }
            $im->setImageFormat('jpeg');
            $im->writeImage($sugar_config['upload_dir'] . basename($filepath) . '_' . $x . '.pdf');
            $urls[] = $sugar_config['upload_dir'] . basename($filepath, '_' . $x . '.pdf');
        }

        return $urls;
    }

    public function pdfToBase64Image($filepath, $thumbnail = false)
    {
        $im = new Imagick();
        $im->setResolution(300, 300);
        $im->readImage($filepath);
        $count = $im->getNumberImages();
        $data = array();
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
