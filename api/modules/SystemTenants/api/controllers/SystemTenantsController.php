<?php

/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SystemTenants\api\controllers;

use SpiceCRM\modules\SystemTenants\SystemTenant;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SpiceDemoData\SpiceDemoDataGenerator;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class SystemTenantsController
{
    /**
     * initializes the tenant
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function initialize(Request $req, Response $res, array $args): Response {
        $tenant = BeanFactory::getBean('SystemTenants', $args['id']);
        return $res->withJson($tenant->initializeTenant());
    }

    /**
     * loads demo data in a client
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws UnauthorizedException
     */
    public function loadDemoData(Request $req, Response $res, array $args): Response
    {
        $populatedTables = [];
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if (!$current_user->is_admin) {
            throw new UnauthorizedException('only admin access');
        }

        $tenant = BeanFactory::getBean('SystemTenants', $args['id']);
        if ($tenant) {
            $tenant->switchToTenant();
            $demoGenerator = new SpiceDemoDataGenerator();
            $demoGenerator->generateAccounts();
            $populatedTables[] = "accounts";
            $demoGenerator->generateContacts();
            $populatedTables[] = "contacts";
            if (DBManagerFactory::getInstance()->tableExists('consumers')) {
                $demoGenerator->generateConsumers();
                $populatedTables[] = "consumers";
            }
            if (DBManagerFactory::getInstance()->tableExists('leads')) {
                $demoGenerator->generateLeads();
                $populatedTables[] = "leads";
            }

            DBManagerFactory::switchInstance(SpiceConfig::getInstance()->config['dbconfig']['db_name'], SpiceConfig::getInstance()->config);
        }

        return $res->withJson(["populatedTables" => $populatedTables]);

    }

    /**
     * loads demo data in a client
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     */
    public function acceptLegalNotice(Request $req, Response $res, array $args): Response
    {
        $authController = AuthenticationController::getInstance();

        if (empty($authController->systemtenantid)) {
            throw new BadRequestException('Only allowed when logged in to a tenant.');
        }

        $dbName = SpiceConfig::getInstance()->config['dbconfig']['db_name'];
        DBManagerFactory::switchToMasterDatabase();

        /* @var SystemTenant */
        $tenant = BeanFactory::getBean('SystemTenants', $authController->systemtenantid);

        $tenant->accept_data = json_encode([
            'ip' => SpiceUtils::getClientIP(),
            'timestamp' => TimeDate::getInstance()->nowDb()
        ]);

        $tenant->save();

        return $res->withJson(['success' => true]);

    }
}
