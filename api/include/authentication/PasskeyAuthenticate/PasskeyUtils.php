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
use SpiceCRM\includes\ErrorHandlers\Exception;
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
     * @throws WebAuthnException
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

        return ['success' => true, 'rootValid' => $data->rootValid, 'metadata' => $this->getAuthenticatorMetadata(base64_decode($data->AAGUID))];
    }

    /**
     * generate a challenge and temporarily save it until the next request
     * used for the request pairs (createArgs, processCreate) and (getArgs, processGet)
     * @param int $timeout in milliseconds
     * @return string
     * @throws Exception
     * @throws \Exception
     */
    private function saveChallenge(int $timeout): string
    {
        $challenge = ($this->webAuthn->getChallenge())->getHex();
        $now = TimeDate::getInstance()->getNow();
        $challengeHash = md5($challenge);

        $db = DBManagerFactory::getInstance();
        $db->insertQuery('authentication_passkey_challenges', [
            'id' => SpiceUtils::createGuid(),
            'challenge' => $challenge,
            'challenge_hash' => $challengeHash,
            'expire_in' => TimeDate::getInstance()->asDb(
                $now->add(DateInterval::createFromDateString("$timeout milliseconds"))
            )
        ]);

        return $challengeHash;
    }

    /**
     * get stored challenge only once and remove its file
     * If the challenge is expired then return null
     * @param string $challengeHash
     * @return ByteBuffer|null
     * @throws WebAuthnException
     * @throws \Exception
     */
    public function getChallenge(string $challengeHash): ?ByteBuffer
    {
        $db = DBManagerFactory::getInstance();

        $challenge = $db->getOne("SELECT challenge FROM authentication_passkey_challenges WHERE challenge_hash = '$challengeHash' AND expire_in > " . $db->now());
        if (!$challenge) return null;

        $db->query("DELETE FROM authentication_passkey_challenges WHERE challenge_hash = '$challengeHash' OR expire_in < " . $db->now());

        return ByteBuffer::fromHex($challenge);
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
        $rpId = $this->db->quote($rpId);
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
        $userId = $this->db->quote($userId);
        $rpId = $this->db->quote($rpId);

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
        $rpId = $this->db->quote($rpId);
        $credentialId = $this->db->quote(base64_encode($credentialId));

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

        $this->removeUserRegistration($data->userId, $data->rpId);
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
     * @param string $aaGuid
     * @return object
     */
    public function getAuthenticatorMetadata(string $aaGuid): object
    {
        $aaGuidList = json_decode(file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . 'metadata' . DIRECTORY_SEPARATOR . 'aaguid.json'));
        $hex = bin2hex($aaGuid);
        $guid = join('-', [substr($hex, 0, 8), substr($hex, 8, 4), substr($hex, 12, 4), substr($hex, 16, 4), substr($hex, 20) ]);
        return $aaGuidList->$guid;
    }
}