<?php

namespace SpiceCRM\includes\SysCurrencies;

class SysCurrenciesLoader
{
    public function loadCurrencies(){
        return SysCurrencies::getInstance()->getAllCurrencies();
    }
}