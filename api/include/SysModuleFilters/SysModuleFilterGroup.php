<?php

namespace SpiceCRM\includes\SysModuleFilters;

use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;

class SysModuleFilterGroup
{
    /**
     * operator constant list
     */
    const O_EMPTY = 'empty';
    /** @var string empty relate */
    const O_EMPTYR = 'emptyr';
    const O_NOTEMPTY = 'notempty';
    /** @var string not empty relate id */
    const O_NOTEMPTYR = 'notemptyr';
    const O_EQUALS = 'equals';
    const O_NOTEQUALS = 'notequals';
    /** @var string equal relate id */
    const O_EQUALR = 'equalr';
    /** @var string starts with relate id */
    const O_STARTSR = 'startsr';
    /** @var string not equal with relate id */
    const O_NOTEQUALR = 'notequalr';
    /** @var string equal related current user */
    const O_EQUALRCU = 'equalrcu';
    /** @var string not equal related current user */
    const O_NOTEQUALRCU = 'notequalrcu';
    const O_ONEOF = 'oneof';
    const O_NOTONEOF = 'notoneof';
    const O_TRUE = 'true';
    const O_FALSE = 'false';
    const O_STARTS = 'starts';
    const O_CONTAINS = 'contains';
    const O_NCONTAINS = 'ncontains';
    const O_GREATER = 'greater';
    const O_GEQUAL = 'gequal';
    const O_LESS = 'less';
    const O_LEQUAL = 'lequal';
    const O_BETWEEN = 'between';
    const O_BETWEEND = 'betweend';
    const O_TODAY = 'today';
    const O_PAST = 'past';
    const O_FUTURE = 'future';
    const O_THISMONTH = 'thismonth';
    const O_NEXTMONTH = 'nextmonth';
    const O_THISYEAR = 'thisyear';
    const O_NEXTYEAR = 'nextyear';
    const O_INNDAYS = 'inndays';
    const O_THISDAY = 'thisday';
    const O_NDAYSAGO = 'ndaysago';
    const O_INLESSTHANNDAYS = 'inlessthanndays';
    const O_INLESSTHANDAYS = 'inlessthandays';
    const O_INMORETHANNDAYS = 'inmorethanndays';
    const O_INLASTNDAYS = 'inlastndays';
    const O_LASTNDAYS = 'lastndays';
    const O_LASTNMONTHS = 'lastnmonths';
    const O_UNTILYESTERDAY = 'untilyesterday';
    const O_FROMTOMORROW = 'fromtomorrow';
    const O_NYEARSAGO = 'nyearsago';
    /**
     * @var array holds the conditions
     */
    private array $conditions = [];
    /**
     * instance of the module filter parser
     * @var SysModuleFilters
     */
    private SysModuleFilters $moduleFilter;
    /**
     * stores the group operator and|or
     * @var string
     */
    private string $operator;

    public function __construct(string $module, $operator = 'and')
    {
        $this->operator = $operator;
        $this->moduleFilter = new SysModuleFilters();
        $this->moduleFilter->filtermodule = $module;
    }

    public function addGroup(SysModuleFilterGroup $group)
    {
        $group = (object)[
            'conditions' => $group->getConditions(),
            'logicaloperator' => $group->getOperator(),
        ];

        $this->conditions[] = $group;

        return $this;
    }

    /**
     * @return array of the conditions
     */
    public function getConditions(): array
    {
        return $this->conditions;
    }

    /**
     * @return string group operator
     */
    public function getOperator(): string
    {
        return $this->operator;
    }

    /**
     * add a condition
     * @param string $field
     * @param string $operator
     * @param $value
     * @param $valueTo
     * @return SysModuleFilterGroup
     */
    public function addCondition(string $field, string $operator, $value, $valueTo = null): SysModuleFilterGroup
    {
        $condition = (object)[
            'field' => $field,
            'operator' => $operator,
            'filtervalue' => $value,
            'filtervalueto' => $valueTo
        ];

        $this->conditions[] = $condition;

        return $this;
    }

    /**
     * Wraps the collected conditions in an associative array
     * @throws Exception
     */
    public function buildFTS(): array
    {
        $group = (object)[
            'conditions' => $this->conditions,
            'logicaloperator' => $this->operator,
        ];

        $hasIndex = SpiceFTSHandler::getInstance()->checkModule($this->moduleFilter->filtermodule, true);
        $filterFieldsIndexed = SpiceFTSHandler::getInstance()->checkFilterDefs($this->moduleFilter->filtermodule, $group);

        if (!$hasIndex || !$filterFieldsIndexed) {
            throw (new Exception("Module {$this->moduleFilter->filtermodule} is not indexed for full text search"))->setErrorCode('noIndex');
        }

        return $this->moduleFilter->buildElasticFilterForGroup($group);
    }

    /**
     * Wraps the collected conditions in an associative array
     */
    public function buildSQL(): string
    {
        $group = (object)[
            'conditions' => $this->conditions,
            'logicaloperator' => $this->operator,
        ];

        $tableName = BeanFactory::newBean($this->moduleFilter->filtermodule)->getTableName();
        return $this->moduleFilter->buildSQLWhereClauseForGroup($group, $tableName);
    }
}