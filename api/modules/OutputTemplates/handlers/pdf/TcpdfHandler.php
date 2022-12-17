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

use TCPDF;

require_once 'vendor/tcpdf6/tcpdf.php';

/**
 * Attention: it is not recommended to use this class with css... only very little support of it!
 * Class TcpdfHandler
 */
class TcpdfHandler extends LibPdfHandler
{
    protected function createInstance()
    {
        return new TCPDF();
    }

    public function process($html = null, array $options = null)
    {
        parent::process($html, $options);

        $this->createTcpdf($this->html_content, $this->options);
        #$this->createTcpdf('<style>'.$this->template->getStyle().'</style>'.$this->html_content, $this->options);
        return true;
    }

    private function createTcpdf($html = null, array $options = null)
    {
        $options = (object) $options;
        $this->class_instance->setPrintHeader(false);
        $this->class_instance->setPrintFooter(false);
        $this->class_instance->SetMargins($options->margin_left ?: 10, $options->margin_top ?: 10, $options->margin_right ?: 10, true);
        $this->class_instance->SetAutoPageBreak(true, 10);
        $this->class_instance->AddPage($options->page_orientation, $options->page_size);
        $this->class_instance->writeHTML($html);
        $this->content = $this->class_instance->Output('', 'S');
        return $this->class_instance;
    }

    public function toDownload($file_name = null)
    {
        if(!$file_name)
            $file_name = $this->template->getFileName();

        if(!$this->content)
            $this->process();

        return $this->class_instance->Output($file_name, 'D');
    }

    public function toFile($destination_path, $file_name = null)
    {
        if(!$file_name)
            $filename = $this->id.'.pdf';

        if(!$this->content)
            $this->process();

        if(!$this->class_instance->Output($destination_path.'/'.$filename, 'F'))
            throw new Exception("Could not save file to $destination_path/$filename!");

        return ['name' => $filename, 'path' => $destination_path, 'mime_type' => 'application/pdf'];
    }

}