<?php

namespace SpiceCRM\includes\authentication\PasskeyAuthenticate;

use DateInterval;
use lbuchs\WebAuthn\Binary\ByteBuffer;
use lbuchs\WebAuthn\WebAuthn;
use lbuchs\WebAuthn\WebAuthnException;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Users\User;

class PasskeyUtils
{
    /**
     * @var WebAuthn holds an instance of the WebAuthn library
     */
    public WebAuthn $webAuthn;
    /**
     * @var object the config params of the WebAuthn library
     */
    public object $config;
    /**
     * @var DBManager database instance
     */
    private DBManager $db;

    public function __construct(string $rpId)
    {
        $this->initialize($rpId);
    }

    /**
     * generate create passkey arguments
     * @param $params
     * @return object
     * @throws \Exception
     */
    public function generateCreateArgs($params): object
    {
        $createArgs = $this->webAuthn->getCreateArgs($params->userId, $params->userName, $params->userDisplayName, 60 * 4, $this->config->requireResidentKey, $this->config->userVerification, $this->config->crossPlatformAttachment);

        $createArgs->secret = $this->saveChallenge($createArgs->publicKey->timeout);

        return $createArgs;
    }

    /**
     * create a new registration for the generated passkey
     * @param $params
     * @return array
     * @throws WebAuthnException|BadRequestException
     */
    public function processCreate($params): array
    {
        $user = AuthenticationController::getInstance()->getCurrentUser();

        $clientDataJSON = !empty($params->clientDataJSON) ? base64_decode($params->clientDataJSON) : null;
        $attestationObject = !empty($params->attestationObject) ? base64_decode($params->attestationObject) : null;
        $challenge = $this->getChallenge($params->secret);

        $data = $this->webAuthn->processCreate($clientDataJSON, $attestationObject, $challenge, $this->config->userVerification === 'required', true, false);

        $data->userId = $user->id;
        $data->userName = $user->user_name;
        $data->userDisplayName = "$user->first_name $user->last_name";

        $this->registerUser($data);

        return ['success' => true, 'rootValid' => $data->rootValid];
    }

    /**
     * generate a challenge and temporarily save it until the next request
     * used for the request pairs (createArgs, processCreate) and (getArgs, processGet)
     * @param int $timeout in milliseconds
     * @return string
     */
    private function saveChallenge(int $timeout): string
    {
        $challenge = ($this->webAuthn->getChallenge())->getHex();

        $now = TimeDate::getInstance()->getNow();

        $content = (object)[
            'expire_in' => $now->add(DateInterval::createFromDateString("$timeout milliseconds"))->getTimestamp(),
            'challenge' => $challenge,
        ];

        $challengeHash = md5($challenge);
        file_put_contents(
            $this->getChallengeFileName($challengeHash), json_encode($content)
        );

        return $challengeHash;
    }

    /**
     * get stored challenge only once and remove its file
     * If the challenge is expired then return null
     * @param string $challengeHash
     * @return ByteBuffer|null
     * @throws WebAuthnException
     */
    public function getChallenge(string $challengeHash): ?ByteBuffer
    {
        $challengeFileName = $this->getChallengeFileName($challengeHash);

        $content = file_get_contents($challengeFileName);
        if (!$content) return null;
        $content = json_decode($content);

        unlink($challengeFileName);

        if ($content->expire_in < time()) {
            return null;
        }

        return ByteBuffer::fromHex($content->challenge);
    }

    /**
     * get challenge file name
     * @param string $challengeHash
     * @return string
     */
    private function getChallengeFileName(string $challengeHash): string
    {
        $path = __DIR__ . DIRECTORY_SEPARATOR . 'challenges' . DIRECTORY_SEPARATOR;
        return $path . $challengeHash;
    }

    /**
     * generate crypt key
     * @return string
     */
    public function getCryptKey(): string
    {
        return base64_encode(json_encode($this->db->dbConfig));
    }

    /**
     * generate get arguments
     * @param $params
     * @return object
     * @throws \Exception
     */
    public function generateGetArgs($params): object
    {
        $ids = [];

        if (!empty($params->username)) {
            /** @var User $user */
            $user = BeanFactory::newBean('Users');
            $user = $user->findByUserName($params->username);
            if ($user) {
                $registration = $this->getRegistrationByUserId($user->id, $params->rpId);
                if ($registration) {
                    $ids[] = $registration->credentialId;
                }
            }
        }

        $getArgs = $this->webAuthn->getGetArgs($ids, 60 * 4, true, true, true, true, true, $this->config->userVerification);
        $getArgs->publicKey->mediation = 'conditional';

        $getArgs->secret = $this->saveChallenge($getArgs->publicKey->timeout);

        return $getArgs;
    }

    /**
     * get registration by user id
     * @param string $userId
     * @param string $rpId
     * @return object|null
     */
    public function getRegistrationByUserId(string $userId, string $rpId): ?object
    {
        $registration = $this->db->fetchOne("SELECT * FROM authentication_passkeys WHERE relying_party = '$rpId' AND user_id = '$userId'");
        if (!$registration) return null;
        return $this->decodeRegistration(
            json_decode($registration['registration_data'])
        );
    }

    /**
     * remove user registration
     * @param string $userId
     * @param string $rpId
     * @return bool|resource
     */
    public function removeUserRegistration(string $userId, string $rpId)
    {
        return $this->db->query("DELETE FROM authentication_passkeys WHERE relying_party = '$rpId' AND user_id = '$userId'");
    }

    /**
     * get registration by credential id
     * @param string $credentialId
     * @param string $rpId
     * @return object|null
     */
    public function getRegistrationByCredentialId(string $credentialId, string $rpId): ?object
    {
        $credentialId = base64_encode($credentialId);
        $registration = $this->db->fetchOne("SELECT * FROM authentication_passkeys WHERE relying_party = '$rpId' AND credential_id = '$credentialId'");
        if (!$registration) return null;
        return $this->decodeRegistration(
            json_decode($registration['registration_data'])
        );
    }

    /**
     * decode registration
     * @param $registration
     * @return object
     */
    private function decodeRegistration($registration): object
    {
        $registration->credentialId = base64_decode($registration->credentialId);
        $registration->AAGUID = base64_decode($registration->AAGUID);
        return $registration;
    }

    /**
     * create and save a new user registration
     * @param $data
     * @return void
     * @throws \Exception
     */
    private function registerUser($data): void
    {
        $data->credentialId = base64_encode($data->credentialId);
        $data->AAGUID = base64_encode($data->AAGUID);
        $entry = [
            'id' => SpiceUtils::createGuid(),
            'user_id' => $data->userId,
            'relying_party' => $data->rpId,
            'registration_data' => $data,
            'credential_id' => $data->credentialId
        ];

        $this->db->query("DELETE FROM authentication_passkeys WHERE relying_party = '$data->rpId' AND user_id = '$data->userId'");
        $this->db->insertQuery('authentication_passkeys', $entry);
    }

    /**
     * initialize a new authenticator instance and load the config
     * @throws WebAuthnException
     */
    private function initialize(string $rpId): void
    {
        $this->webAuthn = new WebAuthn('SpiceCRM WebAuthn', $rpId);
        $this->config = SpiceConfig::getInstance()->get('authentication.passkey') ?? new \stdClass();
        $this->db = DBManagerFactory::getInstance();
    }

    /**
     * get authenticator metadata
     * @param object $registration
     * @return object
     */
    public function getAuthenticatorMetadata(object $registration): object
    {
        $aaGuidList = json_decode(file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . 'metadata' . DIRECTORY_SEPARATOR . 'aaguid.json'));
        $hex = bin2hex($registration->AAGUID);
        $guid = join('-', [substr($hex, 0, 8), substr($hex, 8, 4), substr($hex, 12, 4), substr($hex, 16, 4), substr($hex, 20) ]);
        return $aaGuidList->$guid;
    }
}