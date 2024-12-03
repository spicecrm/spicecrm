<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SpiceImports\api\controllers;

use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SpiceImports\SpiceImport;

class SpiceImportsController{

    /**
     * get the saved spice imports
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function getSavedImports(Request $req, Response $res, array $args): Response {
        if (!SpiceACL::getInstance()->checkAccess('SpiceImports', 'list', true)) {
            throw (new ForbiddenException("Forbidden for details in module SpiceImports."))
                ->setErrorCode('noModuleDetails');
        }

        $bean = BeanFactory::getBean('SpiceImports');
        return $res->withJson($bean->getSavedImports($args['beanName']));
    }

    /**
     * get the file previews
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function getFilePreview(Request $req, Response $res, array $args): Response {
        if (!SpiceACL::getInstance()->checkAccess('SpiceImports', 'edit', true)) {
            throw (new ForbiddenException("Forbidden for details in module SpiceImports."))
                ->setErrorCode('noModuleDetails');
        }

        $params = $req->getQueryParams();
        $bean = BeanFactory::getBean('SpiceImports');
        return $res->withJson($bean->getFilePreview($params));
    }

    /**
     * delete the import files
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function deleteImportFile(Request $req, Response $res, array $args): Response {
        if (!SpiceACL::getInstance()->checkAccess('SpiceImports', 'delete', true)) {
            throw (new ForbiddenException("Forbidden to delete in module SpiceImports."))
                ->setErrorCode('noModuleDelete');
        }

        $filemd5 = $req->getQueryParams()['filemd5'];
        $bean = BeanFactory::getBean('SpiceImports');
        return $res->withJson($bean->deleteImportFile($filemd5));

    }

    /**
     * saves data from an import
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function saveFromImport(Request $req, Response $res, array $args): Response {
        $importData = $req->getParsedBody();

        if (!SpiceACL::getInstance()->checkAccess($importData['module'], 'import')) {
            throw (new ForbiddenException("import for module not allowed"));
        }

        $seed = BeanFactory::getBean('SpiceImports');
        $seed->saveFromImport($importData);
        $handler = new SpiceBeanHandler();
        return $res->withJson($handler->mapBean($seed));
    }

    /**
     * get the spice import log entries
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function getImportLog(Request $req, Response $res, array $args): Response {
        $seed = BeanFactory::getBean('SpiceImports', $args['importId']);
        if(!$seed){
            throw (new ForbiddenException("No Access to this SpiceImport"));
        }

        // gets the query params
        $params = $req->getQueryParams();

        // gets the records
        $logs = $seed->db->fetchLimit("SELECT * FROM spiceimportlogs WHERE import_id = '{$seed->id}' ORDER BY rowpointer", $params['start'] ?: 0, $params['limit'] ?: 50);

        // get the total count
        $totalcount = $seed->db->fetchOne("SELECT COUNT(id) as totalcount FROM spiceimportlogs WHERE import_id = '{$seed->id}'")['totalcount'];

        // get the importData for the header
        $importData = json_decode(html_entity_decode($seed->data));

        return $res->withJson(['header' => $importData->fileHeader, 'totalcount' => (int) $totalcount, 'logs' => $logs ?: []]);
    }

    /**
     * Returns all class names of schedulerjobtasks classes.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getImportMethods(Request $req, Response $res, array $args): Response {
        $classList = [];
        $checkRootPaths = ['include', 'modules', 'extensions/include', 'extensions/modules', 'custom/modules', 'custom/extensions/modules', 'custom/include', 'custom/extensions/include', 'custom/Extension/modules'];
        $module = $args['module'];

        foreach ($checkRootPaths as $checkRootPath) {
            $dirHandle = opendir("./$checkRootPath");
            if ($dirHandle) {
                while (($nextDir = readdir($dirHandle)) !== false) {
                    if ($nextDir != '.' && $nextDir != '..' && $module == $nextDir && is_dir("./$checkRootPath/$module")
                        && file_exists("./$checkRootPath/$module/".  SpiceImport::IMPORT_TASKS_DIRECTORY)
                    ) {
                        $subDirHandle = opendir("./$checkRootPath/$module/" . SpiceImport::IMPORT_TASKS_DIRECTORY);
                        if ($subDirHandle) {
                            while (false !== ($nextFile = readdir($subDirHandle))) {
                                if (preg_match('/.php$/', $nextFile)) {
                                    require_once("./$checkRootPath/$module/" . SpiceImport::IMPORT_TASKS_DIRECTORY . "/$nextFile");
                                }
                            }
                        }
                    }
                }
            }
        }

        foreach (get_declared_classes() as $className) {
            if (strpos($className, SpiceImport::IMPORT_TASKS_DIRECTORY) !== false) {
                $classList[] = $className;
            }
        }

        return $res->withJson($classList);
    }

}