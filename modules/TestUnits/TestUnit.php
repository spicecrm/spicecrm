<?php
/** Link checker
 */

class LinkChecker{

	
	
	
	public function __construct($modulea, $ida, $linka2b, $moduleb, $linkb2a= null, $idb= null){
	    echo '<pre>    Check '.$modulea. ' auf  '.$moduleb;
			$a = BeanFactory::getBean($modulea, $ida);
        echo '<pre>'.print_r($a_related[0]->id, true);

        $a_related = $a->get_linked_beans($linka2b, $moduleb);
            echo '<pre>'.print_r($a_related[0]->id, true);

        if($linkb2a) {
            echo '<pre>    Check ' . $moduleb . ' auf  ' . $modulea;
            $b = BeanFactory::getBean($moduleb, $idb);
            $b_related = $b->get_linked_beans($linkb2a, $modulea);
            echo '<pre>' . print_r($b_related[0]->id, true);
        }
    }

}

new LinkChecker("ProjectActivities", "41942bc1-27f9-5876-c22c-2b14c5d7a0e1", "projectwbss",
    "ProjectWBSs", "projectactivities", "1012ff12-58cc-2a87-7034-082d4c61ad93");
//new LinkChecker("ServiceOrders", "order1", "notes", "Notes", "serviceorders", "note2");


#new LinkChecker("ServiceQueues", "queue1", "users", "Users", "servicequeues", "1");
#new LinkChecker("ServiceQueues", "queue1", "servicetickets", "ServiceTickets", "servicequeues", "ticket1");
#new LinkChecker("ServiceCalls", "call1", "contacts", "Contacts", "servicecalls", "demo11590");
#new LinkChecker("ServiceCalls", "call1", "servicetickets", "ServiceTickets", "servicecalls", "ticket1");

//new LinkChecker("ServiceFeedbacks", "feed1", "servicetickets", "ServiceTickets", "servicefeedbacks", "ticket1");
//new LinkChecker("ServiceFeedbacks", "feed2", "serviceorders", "ServiceOrders", "servicefeedbacks", "order1");
//new LinkChecker("ServiceFeedbacks", "feed3", "servicecalls", "ServiceCalls", "servicefeedbacks", "call1");
//new LinkChecker("ServiceFeedbacks", "feed1", "contacts", "Contacts", "servicefeedbacks", "demo11590");

//new LinkChecker("ServiceEquipments", "equipment1", "contacts", "Contacts", "serviceequipments", "demo11590");
//new LinkChecker("ServiceEquipments", "equipment1", "accounts", "Accounts", "serviceequipments", "demo11590");
//new LinkChecker("ServiceEquipments", "equipment1", "serviceorders", "ServiceOrders", "serviceequipments", "order1");
//new LinkChecker("ServiceEquipments", "equipment1", "servicetickets", "ServiceTickets", "serviceequipments", "ticket1");

//new LinkChecker("ServiceTickets", "ticket1", "calls", "Calls", "servicetickets", "call1");
//new LinkChecker("ServiceOrders", "order1", "calls", "Calls", "serviceorders", "call2");
//new LinkChecker("ServiceTickets", "ticket1", "meetings", "Meetings", "servicetickets", "meeting1");
//new LinkChecker("ServiceOrders", "order1", "meetings", "Meetings", "serviceorders", "meeting2");
//new LinkChecker("ServiceTickets", "ticket1", "tasks", "Tasks", "servicetickets", "task1");
//new LinkChecker("ServiceOrders", "order1", "tasks", "Tasks", "serviceorders", "task2");
//new LinkChecker("ServiceTickets", "ticket1", "notes", "Notes", "servicetickets", "note1");
//new LinkChecker("ServiceOrders", "order1", "notes", "Notes", "serviceorders", "note2");