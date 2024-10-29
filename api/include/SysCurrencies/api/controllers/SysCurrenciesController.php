<?php

namespace SpiceCRM\includes\SysCurrencies\api\controllers;

use Psr\Http\Message\RequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SysCurrencies\SysCurrencies;
use SpiceCRM\includes\utils\SpiceUtils;

class SysCurrenciesController
{
    /**
     * returns all currencies in the system
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function getCurrencies(Request $req, Response $res, $args): Response
    {
        return $res->withJson(SysCurrencies::getInstance()->getAllCurrencies(false));
    }

    /**
     * loads the curencies from File
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     */
    public function loadCurrencies(Request $req, Response $res, $args): Response
    {
        return $res->withJson(['success' => SysCurrencies::getInstance()->initializeCurrencies()]);
    }

    /**
     * sets the system currency
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws \SpiceCRM\includes\ErrorHandlers\NotFoundException
     */
    public function setSystemCurrency(Request $req, Response $res, $args): Response
    {
        $hasSys = DBManagerFactory::getInstance()->fetchOne("SELECT id FROM syscurrencies WHERE is_systemcurrency=1");
        if($hasSys){
            throw new ForbiddenException('System Currency is already set');
        }

        return $res->withJson(['success' => SysCurrencies::getInstance()->setSystemCurrency($args['currencyid'])]);
    }

    /**
     * sets a currency with the given ID as active
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     */
    public function setCurrencyActive(Request $req, Response $res, $args): Response
    {
        return $res->withJson(['success' => SysCurrencies::getInstance()->toggleActive($args['currencyid'], true)]);
    }

    /**
     * sets a currency with the given ID as inactive
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     */
    public function setCurrencyInactive(Request $req, Response $res, $args): Response
    {
        return $res->withJson(['success' => SysCurrencies::getInstance()->toggleActive($args['currencyid'], false)]);
    }

    public function getExchangeRates(Request $req, Response $res, $args): Response
    {
        return $res->withJson(SysCurrencies::getInstance()->getExchangeRates($args['currencyid']));
    }
}