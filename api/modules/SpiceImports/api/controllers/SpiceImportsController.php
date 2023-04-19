<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SpiceImports\api\controllers;

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
        if (!SpiceACL::getInstance()->checkAccess('SpiceImports', 'edit', true)) {
            throw (new ForbiddenException("Forbidden for details in module SpiceImports."))
                ->setErrorCode('noModuleDetails');
        }

        $bean = BeanFactory::getBean('SpiceImports');
        return $res->withJson( $bean->saveFromImport(
            $args['objectimport'] ? json_decode( $args['objectimport'] ) : ( $req->getParsedBody()['objectimport'] ?: [] )
        ));
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
        if (!SpiceACL::getInstance()->checkAccess('SpiceImports', 'detail', true)) {
            throw (new ForbiddenException("Forbidden for details in module SpiceImports."))
                ->setErrorCode('noModuleDetails');
        }

        $id = $args['importId'];
        $db = DBManagerFactory::getInstance();
        $logs = [];

        $spiceImportLogIds = $db->query("SELECT * FROM spiceimportlogs WHERE import_id = '$id'");
        while ($log = $db->fetchByAssoc($spiceImportLogIds)) {
            $logs[] = $log;
        }

        return $res->withJson($logs);
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