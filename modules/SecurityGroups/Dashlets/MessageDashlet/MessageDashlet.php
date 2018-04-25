<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');


require_once('include/Dashlets/Dashlet.php');

class MessageDashlet extends Dashlet { 

    function MessageDashlet($id, $def = null) {
        $this->isConfigurable = false;
        $this->isRefreshable = false;
        parent::Dashlet($id, $def);

        if(empty($def['title'])) $this->title = translate('LBL_HOMEPAGE_TITLE', 'SecurityGroups');
    }
    
    /**
     * 
     * @return the fully rendered dashlet
     */
    function display(){
        
        $dashlet_output = <<<EOQ
        
<link rel="stylesheet" type="text/css" href="modules/SecurityGroups/style.css"/>

<div class="so-info">
    <h1>Team Collaboration</h1>
    <br/>
    <p>With SecuritySuite - Full Edition your users can collaborate with other team members via the Group Message Dashlet. Need to send out a message to everyone in your company? Admins have the ability to send a broadcast message.
    </p>
    <br/>
    <a href="https://www.sugaroutfitters.com/docs/securitysuite/features" target="_blank">Learn more about all of the available features in SecuritySuite - Full Edition</a>
    <br/><br/>
    <div class="so-center">
        <img class="so-shadow" src="https://www.eggsurplus.com/addons/ss_messagedashlet.png" width="440" height="245"/>
    </div>
    <div class="so-center so-cta-container">
        <a href="https://www.sugaroutfitters.com/addons/securitysuite/pricing" target="_blank" class="so-btn so-btn-cta so-btn-cta-lg">
            See Plans and Pricing<br/>
            <span class="so-cta-small">30-day free trial, sign up in 60 seconds</span>
        </a>
    </div>
</div>

        
EOQ;
        return $dashlet_output;
    }    





    static function shouldDisplay() {
        //could potential make this a SecuritySuite setting
        return true;

    }    
}
?>