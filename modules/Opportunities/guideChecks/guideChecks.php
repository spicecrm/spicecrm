<?php
class standardOpportunityGuideChecks{

    public function qualification_activitiy($opportunity){
        $calls = $opportunity->get_linked_beans('calls', 'Calls', array(),0, -1, 0, "calls.status ='held'");
        if(count($calls) > 0)
            return true;

        $meetings = $opportunity->get_linked_beans('meetings', 'Meetings', array(),0, -1, 0, "calls.status ='held'");
        if(count($meetings) > 0)
            return true;

        return false;
    }

    public function qualification_projectmanager($opportunity){
        global $db;

        $pmRecord = $db->fetchByAssoc($db->query("SELECT count(id) pmcount FROM opportunities_contacts WHERE deleted = 0 AND contact_role = 'Project Manager' AND opportunity_id = '".$opportunity->id."'"));
        if($pmRecord['pmcount'] > 0)
            return true;

        return false;
    }

    public function qualification_businessneeds($opportunity){
        global $db;

        if(!empty($opportunity->cust_busneeds))
            return true;

        return false;
    }

    public function analysis_activitiy($opportunity){
        $meetings = $opportunity->get_linked_beans('meetings', 'Meetings', array(),0, -1, 0, "meetings.status ='held'");
        if(count($meetings) > 0)
            return true;

        return false;
    }

    public function analysis_businessevaluator($opportunity){
        global $db;

        $pmRecord = $db->fetchByAssoc($db->query("SELECT count(id) pmcount FROM opportunities_contacts WHERE deleted = 0 AND contact_role = 'Business Evaluator' AND opportunity_id = '".$opportunity->id."'"));
        if($pmRecord['pmcount'] > 0)
            return true;

        return false;
    }

    public function analysis_budgetidentified($opportunity){

        if(!empty($opportunity->budget))
            return true;

        return false;
    }

    public function qualification_businesspainpoints($opportunity){
        global $db;

        if(!empty($opportunity->cust_busneeds) && !empty($opportunity->cust_painpoints))
            return true;

        return false;
    }

    public function vprop_valueproposition($opportunity){

        if(!empty($opportunity->cust_busneeds) && !empty($opportunity->cust_painpoints) && !empty($opportunity->cust_solutionproposal) && !empty($opportunity->cust_valueproposition))
            return true;

        return false;
    }

    public function vprop_businessdecisionmaker($opportunity){
        global $db;

        $pmRecord = $db->fetchByAssoc($db->query("SELECT count(id) pmcount FROM opportunities_contacts WHERE deleted = 0 AND contact_role = 'Business Decision Maker' AND opportunity_id = '".$opportunity->id."'"));
        if($pmRecord['pmcount'] > 0)
            return true;

        return false;
    }
}