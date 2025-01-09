<?php

/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SystemTenants\api\controllers;

use Exception;
use SpiceCRM\extensions\modules\LandingPages\LandingPage;
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
        set_time_limit(300);
        $tenant = BeanFactory::getBean('SystemTenants', $args['id']);
        return $res->withJson($tenant->initializeTenant());
    }

    /**
     * confirm the tenant and process the initialization
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function confirmTenant(Request $req, Response $res, array $args): Response
    {
        /** @var SystemTenant $tenant */
        $tenant = BeanFactory::getBean('SystemTenants', $args['id']);

        if ($tenant->systemtenant_status == 'pending') {
            $tenant->systemtenant_status = 'confirmed';
            $tenant->save();
        }

        $redirectUrl = SpiceConfig::getInstance()->get('multitenancy.confirm_redirect_url');

        if (!empty($redirectUrl)) {
            return $res->withHeader('Location', $redirectUrl)->withStatus(302);
        }

        # load the landingpage content
        /** @var LandingPage $landingPage */
        $landingPage = BeanFactory::getBean('LandingPages', SpiceConfig::getInstance()->get('multitenancy.confirm_landing_page_id'));

        if ($landingPage) {
            $lpContent = $landingPage->parse($tenant);
        } else {
            $lpContent = ['content' => '<h1>Misconfiguration issue. Please contact the system administrator</h1>'];
        }

        $res->getBody()->write($lpContent['content']);
        return $res->withHeader('Content-Type', 'text/html');
    }

    /**
     * initializes the tenant
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     */
    public function createTenant(Request $req, Response $res, array $args): Response {
        $data = (object) $req->getParsedBody();
        $created = SystemTenant::createTenantFromInquiry($data);
        return $res->withJson(['success' => $created]);
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

        /** @var SystemTenant $tenant */
        $tenant = BeanFactory::getBean('SystemTenants', $args['id']);
        if ($tenant) {

            SystemTenant::switchToTenant($tenant->id);

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

            $tenant::switchToMaster();
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

        SystemTenant::switchToMaster();

        /* @var SystemTenant */
        $tenant = BeanFactory::getBean('SystemTenants', $authController->systemtenantid);

        $tenant->accept_data = json_encode([
            'ip' => SpiceUtils::getClientIP(),
            'timestamp' => TimeDate::getInstance()->nowDb()
        ]);

        $tenant->save();

        return $res->withJson(['success' => true]);
    }

    /**
     * create an authentication user entry
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function createAuthUser(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();

        $db = DBManagerFactory::getInstance();

        $db->insertQuery('tenant_auth_users', [
            'id' => $params['id'],
            'tenant_id' => $params['tenantId'],
            'username' => $params['username'],
            'user_hash' => $params['password'],
        ]);

        return $res->withJson(['success' => true]);
    }
}
