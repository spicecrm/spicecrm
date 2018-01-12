<?php
/**
 * introduced in version 20170900
 * mainly used in combination with KReporter to allow queries on fiscal year, quarter, month
 * since "normal life" calendar does not correspond to fiscal calendar
 */
$modInvisList[] = 'CompanyFiscalPeriods';
$beanList['CompanyFiscalPeriods'] = 'CompanyFiscalPeriod';
$beanFiles['CompanyFiscalPeriod'] = 'modules/CompanyFiscalPeriods/CompanyFiscalPeriod.php';
