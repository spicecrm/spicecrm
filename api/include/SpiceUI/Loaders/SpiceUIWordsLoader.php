<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceUI\Loaders;

use SpiceCRM\includes\database\DBManagerFactory;

class SpiceUIWordsLoader
{
    /**
     * get reserved words for all database types
     *
     * @param string $context
     * @param string $status
     * @return array|array[]
     * @throws \Exception
     */
    public static function getWords($context = 'db', $status = null) {
        $mapWordStatusForResponse = ['reserved' => 'reservedwords', 'keyword' => 'keywords'];
        $whereClause = '';
        if(!empty($wordcontext)){
            $whereClause.=" AND wordcontext='$context'";
        }
        if(!empty($status)){
            $whereClause.=" AND wordstatus='$status'";
        }
        $db = DBManagerFactory::getInstance();
        $retArray = [];
        $words = $db->query("SELECT word, wordstatus FROM sysreservedwords WHERE deleted=0 {$whereClause}");
        while($word = $db->fetchByAssoc($words)) {
            $retArray[$mapWordStatusForResponse[$word['wordstatus']]][] = $word['word'];
        }
        return $retArray;
    }




}