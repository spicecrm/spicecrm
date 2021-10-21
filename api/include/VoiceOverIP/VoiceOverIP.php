<?php
namespace SpiceCRM\includes\VoiceOverIP;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSocket\SpiceSocket;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;

abstract class VoiceOverIP
{
    const DIRECTION_INCOMING = 'inbound';
    const DIRECTION_OUTGOING = 'outbound';

    protected $preferenceName;
    protected $preferenceCategory;
    protected $config;
    protected $channelPrefix;

    /**
     * Returns the users preferences.
     *
     * @return mixed
     */
    public function getPreferences() {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $prefs = $current_user->getPreference($this->preferenceName, $this->preferenceCategory);

        return $prefs ?: [];
    }

    /**
     * Sets the users preferences.
     *
     * @param $prefs
     * @return bool
     */
    public function setPreferences($prefs) {
        $connector = $this->getNewConnector();

        // overwrite phoneusername, username and password
        $connector->phoneusername = $prefs['phoneusername'];
        $connector->username = $prefs['username'];
        $connector->userpass = $prefs['userpass'];

        if ($connector->login()) {
            $current_user = AuthenticationController::getInstance()->getCurrentUser();
            $current_user->setPreference($this->preferenceName, $prefs, 0, $this->preferenceCategory);
            $current_user->savePreferencesToDB();
            return true;
        }

        return false;
    }

    /**
     * Saves the call information in the DB.
     *
     * @param $call
     * @throws \Exception
     */
    protected function writeCall($call) {
        $db = DBManagerFactory::getInstance();

        $record = $db->fetchByAssoc($db->query("SELECT id FROM voipcalls WHERE id = '{$call->id}'"));
        if ($record) {
            $db->query("UPDATE voipcalls SET callstate = '{$call->state}' WHERE id = '{$call->id}'");
        } else {
            $db->query("INSERT INTO voipcalls (id, channel, calldirection, callstate, callednumber, callernumber) 
VALUES('{$call->id}','{$call->channel}','{$call->direction}','{$call->state}','{$call->callednumber}','{$call->callernumber}')");
        }
    }

    /**
     * Logs into VoIP.
     *
     * @return bool
     */
    public function login() {
        $connector = $this->getNewConnector();
        return $connector->login();
    }

    /**
     * Returns a Call object.
     *
     * @param $channel
     * @param $direction
     * @param $id
     * @param $state
     * @param $callernumber
     * @param $callednumber
     * @param $event
     * @return VoiceOverIPCall
     */
    protected function createCall($channel, $direction, $id, $state, $callernumber, $callednumber, $event) {
        $call = new VoiceOverIPCall();

        $call->channel      = $this->channelPrefix . $channel;
        $call->direction    = $direction;
        $call->id           = $id;
        $call->state        = $state;
        $call->callernumber = $callernumber;
        $call->callednumber = $callednumber;
        $call->event        = $event;

        return $call;
    }

    /**
     * postToNode
     *
     * Executes a cURL request that sends data to the node.js server.
     *
     * @param $data
     * @return mixed
     */
    public function notifySocket($namespace, $room, $data) {

        SpiceSocket::getInstance()->emit(
            $namespace,
            'update',
            $room,
            $data
        );

        return true;
    }

    /**
     * Hangs up the call.
     *
     * @param $callId
     * @return bool
     */
    public function hangupcall($callId) {
        $connector = $this->getNewConnector();
        return $connector->hangupcall($callId);
    }

    /**
     * Returns a call with the given ID.
     *
     * @param $callId
     * @return mixed
     */
    protected function getCall($callId) {
        $db = DBManagerFactory::getInstance();
        $record = $db->fetchByAssoc($db->query("SELECT * FROM voipcalls WHERE id = '$callId'"));
        return $record;
    }

    /**
     * Returns a new VoIP connector.
     *
     * @return mixed
     */
    protected abstract function getNewConnector();

    /**
     * Starts an outgoing call.
     *
     * @param $mdisdn
     * @return mixed
     */
    public abstract function initiateCall($mdisdn);
}
