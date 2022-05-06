<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SpiceACLProfiles;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;

class SpiceACLProfile extends SpiceBean {

    /**
     * returns the raw database rows of  spiceaclprofiles for a specified userId
     * @param $userId
     * @return array
     * @throws \Exception
     */
    public static function getProfilesForUserRows($userId) {
        $db = DBManagerFactory::getInstance();
        $q="SELECT p.* FROM spiceaclprofiles_users pu inner join spiceaclprofiles p on p.id=pu.spiceaclprofile_id where pu.user_id='".$db->quote($userId)."' or pu.user_id='*'";
        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
               $spiceAclRoles[]=$row;
            }
        }
        return $spiceAclRoles;
    }

    /**
     * returns an array of acl profiles allocated to specified user
     * @param $userId
     * @return SpiceACLProfile[]
     * @throws \Exception
     */
    public static function getProfilesforUser($userId) {
        $profiles=[];
        foreach(self::getProfilesForUserRows($userId) as $spiceAlcProfileRow) {
            $profiles[]=BeanFactory::getBean("SpiceACLProfiles", $spiceAlcProfileRow['id']); //todo getBean returns false ... module is not known.
        }
        return $profiles;
    }

    /**
     * set status value d to deactivate profile
     * @return bool
     */
    public function deactivate() {
        $this->status = 'd';
        return true;
    }

    /**
     * set status value r to activate profile
     * @return bool
     */
    public function activate() {
        $this->status = 'r';
        return true;
    }

    /**
     * @return string
     */
    public function get_summary_text() {
        return $this->name;
    }

    /**
     * @param $interface
     * @return false
     */
    public function bean_implements($interface) {
        switch ($interface) {
            case 'ACL':return false;
        }
        return false;
   }
}
