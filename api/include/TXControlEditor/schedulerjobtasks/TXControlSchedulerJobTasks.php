<?php

namespace SpiceCRM\includes\TXControlEditor\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\DataStreams\StreamFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\TXControlEditor\TXControlHandler;

class TXControlSchedulerJobTasks
{
    /**
     * convert html field content for a module to docx file and save the file and md5 in upload folder
     * @param string|null $params
     * @return array|void
     * @throws Exception
     */
    public function convertHtmlFieldToDocx(?string $params = null)
    {
        $params = json_decode($params);

        if (!$params) return ['success' => false, 'message' => 'Missing parameters'];

        $db = DBManagerFactory::getInstance();
        $bean = BeanFactory::getBean($params->module);

        $query = $db->limitQuery("SELECT id, $params->fieldHtml AS content FROM $bean->_tablename WHERE deleted != 1 AND ({$params->fieldDocxPrefix}_md5 IS NULL OR {$params->fieldDocxPrefix}_md5 = '')", 0, 100);
        $txControlHandler = TXControlHandler::getInstance();

        while ($row = $db->fetchByAssoc($query)) {

            $docxFile = base64_decode($txControlHandler->convert(base64_encode($row['content']), 'DOCX'));
            $docXMd5 = md5($docxFile);
            file_put_contents(StreamFactory::getPathPrefix('upload') . $docXMd5, $docxFile);

            $pdfFile = base64_decode($txControlHandler->convert(base64_encode($row['content']), 'PDF'));
            $pdfMd5 = md5($pdfFile);
            file_put_contents(StreamFactory::getPathPrefix('upload') . $pdfMd5, $pdfFile);

            $db->updateQuery($bean->_tablename, ['id' => $row['id']], [
                "{$params->fieldDocxPrefix}_md5" => $docXMd5,
                "{$params->fieldDocxPrefix}_name" => 'new',
                "{$params->fieldDocxPrefix}_mime_type" => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                "{$params->fieldDocxPrefix}_pdf_md5" => $pdfMd5,
                "{$params->fieldDocxPrefix}_pdf_name" => 'new',
                "{$params->fieldDocxPrefix}_pdf_mime_type" => 'application/pdf',
            ]);
        }

        return ['success' => true];
    }
}