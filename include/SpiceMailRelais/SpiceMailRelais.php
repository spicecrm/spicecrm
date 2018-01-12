<?php
class SpiceMailRelais
{
    private $addresses = array();
    private $email = array();
    private $service;


    function __construct($relaisId)
    {
        global $db;
        $mailrelais = $db->fetchByAssoc($db->query("SELECT service, api_key, username, password, from_email, from_name FROM sysmailrelais WHERE id = '$relaisId'"));
        if(file_exists('include/SpiceMailRelais/'.$mailrelais['service'].'/'.$mailrelais['service'].'.php')){
            include_once('include/SpiceMailRelais/'.$mailrelais['service'].'/'.$mailrelais['service'].'.php');
            if(class_exists($mailrelais['service'])){
                $this->service = new $mailrelais['service']($mailrelais);
            }else return false;
        }else return false;
    }
    
    function addAddress($address, $name, $field = 'to'){
        if($field == 'to' || $field == 'cc' || $field == 'bcc')
        $newAddress = array();
        if(!empty($address)){
            $newAddress['email'] = $address;
        }else{
            exit;
        }
        if(!empty($name)){
            $newAddress['name'] = $name;
        }
        $this->addresses[$field][] = $newAddress;
    }
    
    function addContent($content, $contentType = 'text/plain'){
        if(!empty($content)){
            $this->email['content'][] = array(
                'type' => $contentType,
                'value' => $content
            );
        }
    }

    function setSubject($subject){
        if(!empty($subject)){
            $this->email['subject'] = $subject;
        }
    }

    function send(){
        return $this->service->send($this->addresses, $this->email);
    }

}