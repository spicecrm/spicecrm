<?php

namespace SpiceCRM\modules\Documents;

use SpiceCRM\data\SpiceBean;

class Document extends SpiceBean
{
    public function save($check_notify = false, $fts_index_bean = true)
    {
        if($this->isNew() && !empty($this->file_name)){
            $this->file_name = $this->name;
        }

        if($this->isNew() && !empty($this->file_pdf_name)){
            $this->file_pdf_name = $this->name;
        }

        return parent::save($check_notify, $fts_index_bean);
    }
}