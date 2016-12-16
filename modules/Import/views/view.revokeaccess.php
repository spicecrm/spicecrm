<?php
/*
 * Your installation or use of this SugarCRM file is subject to the applicable
 * terms available at
 * http://support.sugarcrm.com/06_Customer_Center/10_Master_Subscription_Agreements/.
 * If you do not agree to all of the applicable terms or do not have the
 * authority to bind the entity as an authorized representative, then do not
 * install or use this SugarCRM file.
 *
 * Copyright (C) SugarCRM Inc. All rights reserved.
 */

class ImportViewRevokeAccess extends SugarView
{
    /** {@inheritdoc} */
    public function process()
    {
        if (isset($_REQUEST['application'])) {
            $response = array(
                'result' => $this->revokeAccess($_REQUEST['application']),
                'sources' => $this->getAuthenticatedImportableExternalEAPMs(),
            );
        } else {
            $response = array(
                'result' => false,
            );
        }

        header('Content-Type: application/json');
        echo json_encode($response);
    }

    private function revokeAccess($application)
    {
        if ($application == 'Google') {
            require_once 'include/externalAPI/Google/ExtAPIGoogle.php';
            $api = new ExtAPIGoogle();
            return $api->revokeToken();
        }

        return false;
    }

    private function getAuthenticatedImportableExternalEAPMs()
    {
        return ExternalAPIFactory::getModuleDropDown('Import', false, false);
    }
}
