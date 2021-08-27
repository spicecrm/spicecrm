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

namespace SpiceCRM\modules\Documents\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

/**
 * Class DocumentsController
 *
 * @package SpiceCRM\modules\Documents\api\controllers
 */
class DocumentsController
{
    /**
     * createas a new revision from a base64 string
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     */
    public function revisionFromBase64(Request $req, Response $res, array $args): Response
    {
        $document = BeanFactory::getBean('Documents', $args['id']);
        if (!$document) {
            throw new NotFoundException('Document not found');
        }

        $body = $req->getParsedBody();

        $documentRevision = BeanFactory::getBean('DocumentRevisions');
        $documentRevision->id = create_guid();
        $documentRevision->new_with_id = true;

        // generate the attachment
        $attachment = SpiceAttachments::saveAttachmentHashFiles('DocumentRevisions', $documentRevision->id, ['filename' => $body['file_name'], 'file' => $body['file'], 'filemimetype' => $body['file_mime_type']]);

        $documentRevision->file_name = $body['file_name'];
        $documentRevision->file_md5 = $attachment[0]['filemd5'];
        $documentRevision->file_mime_type = $body['file_mime_type'];

        $documentRevision->document_id = $document->id;
        $documentRevision->documentrevisionstatus = $body['documentrevisionstatus'];
        $documentRevision->save();

        $document->file_md5 = $attachment[0]['filemd5'];
        $document->save();
    }
}
