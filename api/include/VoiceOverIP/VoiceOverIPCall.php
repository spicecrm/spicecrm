<?php
namespace SpiceCRM\includes\VoiceOverIP;

class VoiceOverIPCall
{
    public $channel;
    public $direction;
    public $event;
    public $id;
    public $state;
    public $callernumber;
    public $callednumber;
    public $activecallid; // introduced for alcatel

    public function __construct() {

    }
}
