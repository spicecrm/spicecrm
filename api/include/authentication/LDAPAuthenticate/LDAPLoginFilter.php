<?php
namespace SpiceCRM\includes\authentication\LDAPAuthenticate;

class LDAPLoginFilter {


    /**
     * create full filter string
     * @param $loginAttribute
     * @param $loginAttributeValue
     * @param $loginFilter
     * @return string
     */
    public function buildLdapSearchFilter($loginAttribute, $loginAttributeValue, $loginFilter){
        $filter = "(&";
        $filter.="(".$loginAttribute."=".$loginAttributeValue.")";
        if($loginFilter){
            $filter.= $loginFilter;
        }
        $filter.= ")";
        return $filter;
    }



}