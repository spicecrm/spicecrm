<?php

namespace SpiceCRM\includes\SpiceLanguages;

use DirectoryIterator;
use SpiceCRM\includes\database\DBManagerFactory;

class SpiceLanguageFilesToDB {

    private $db;
    public $langs = [ 'en_us', 'de_DE', 'es_es' ];
    private $langfiles;
    private $coreLabels;
    private $coreTranslations;
    # private $coreTranslationTexts;

    function __construct() {
        $db = DBManagerFactory::getInstance();
        $this->db = $db;
    }

    /*
     * Read the core labels from the database. They will be needed later to prevent doublettes.
     */
    public function readCoreLabelsFromDB() {

        $this->coreLabels = [];
        $this->coreTranslations = [];
        foreach ( $this->langs as $v ) $this->coreTranslations[$v] = [];

        $res = $this->db->query('SELECT name, syslanguage, translation_default FROM syslanguagelabels l INNER JOIN syslanguagetranslations t ON l.id = t.syslanguagelabel_id');
        while( $row = $this->db->fetchByAssoc( $res )) {
            if ( !isset( $this->coreLabels[$row['name']] )) $this->coreLabels[$row['name']] = [];
            if ( !isset( $this->coreLabels[$row['name']][$row['syslanguage']] )) $this->coreLabels[$row['name']][$row['syslanguage']] = $row['translation_default'];
            if ( !isset( $this->coreTranslations[$row['syslanguage']][$row['translation_default']] ))
                $this->coreTranslations[$row['syslanguage']][$row['translation_default']] = $row['name'];
                # $this->coreTranslationTexts[$row['syslanguage']][$this->simplifyString( $row['translation_default'] )][] = $row['name'];
        }

    }

    /*
     * Determine all the files where the custom labels are stored (with full paths).
     */
    function determineFilenames() {

        $this->langfiles = [];
        foreach ( $this->langs as $v ) $this->langfiles[$v] = [];

        if ( is_dir( 'custom/Extension/application/Ext/Language' )) {
            foreach ( new DirectoryIterator( 'custom/Extension/application/Ext/Language' ) as $langfile ) {
                if ( $langfile->isDot() ) continue;
                if ( preg_match( '#^(en_us|de_DE)\.#', $langfile->getFilename(), $found ) )
                    $this->langfiles[$found[1]][] = $langfile->getPathname();
            }
        }

        if ( is_dir( 'custom/Extension/modules' )) {
            foreach ( new DirectoryIterator( 'custom/Extension/modules' ) as $moduleFolder ) {
                if ( $moduleFolder->isDot() ) continue;
                if ( is_dir( $moduleFolder->getPathname() . '/Ext/Language' ) ) {
                    foreach ( new DirectoryIterator( $moduleFolder->getPathname() . '/Ext/Language' ) as $langfile ) {
                        if ( $langfile->isDot() ) continue;
                        if ( preg_match( '#^(en_us|de_DE)\.#', $langfile->getFilename(), $found ) )
                            $this->langfiles[$found[1]][] = $langfile->getPathname();
                    }
                }
            }
        }

        if ( is_dir( 'custom/include/language' )) {
            foreach ( new DirectoryIterator( 'custom/include/language' ) as $langfile ) {
                if ( $langfile->isDot() ) continue;
                if ( preg_match( '#^(en_us|de_DE)\.#', $langfile->getFilename(), $found ))
                    $this->langfiles[$found[1]][] = $langfile->getPathname();
            }
        }

    }

    /*
     * Read all custom labels from their files.
     */
    function getLabelsFromFiles() {

        if ( !isset( $this->langfiles )) $this->determineFilenames();

        $strings = [];
        foreach ( $this->langs as $lang ) {
            $app_strings = [];
            $mod_strings = [];
            foreach ( $this->langfiles[$lang] as $langfile ) {
                include $langfile;
            }
            foreach ( array_merge( $app_strings, $mod_strings ) as $label => $translation ) {
                if ( !isset( $strings[$label] )) $strings[$label] = [ 'toTransfer' => false, 'translations' => [] ];
                $strings[$label]['translations'][$lang] = $translation;
            }

        }
        return $strings;

    }

    /*
     * For example: "Phone Number: " and "Phone number" should be treated equal. So simplify the strings.
     */
    private function simplifyString( $string ) {
        $string = strtr( $string, [ 'Ä' => 'AE', 'Ö' => 'OE', 'Ü' => 'UE', 'ä' => 'ae', 'ö' => 'oe', 'ü' => 'ue', 'ß' => 'ss' ] );
        $string = strtolower( $string );
        $string = preg_replace('#[^\w\d]#', ' ', $string );
        return trim( $string );
    }

    public function transferFromFilesToDB() {

        $this->readCoreLabelsFromDB();
        $labels = $this->getLabelsFromFiles();

        $labelsAlreadyInCore = [];
        $labelsMightBeAlreadyInCore = [];
        #$labelsWithDifferentNameInCore = [];
        foreach ( $labels as $name => $v ) {

            if ( $v['toTransfer'] ) continue; # Label has been already found, stored and marked for transfer.

            # If the label doesn't exist in core OR the number of translations for this label is larger than in core: It have to be transfered.
            if ( !isset( $this->coreLabels[$name] ) or count( $v['translations'] ) > count( $this->coreLabels[$name] )) {
                $labels[$name]['toTransfer'] = true;

            # The label exists in core and the number of translations is equal or smaller, compare the translations to prove for full equality:
            } else {
                foreach ( $labels[$name]['translations'] as $lang => $string ) {
                    if ( isset( $this->coreLabels[$name][$lang] ) ) {
                        $compare1 = $this->simplifyString( $string );
                        $compare2 = $this->simplifyString( $this->coreLabels[$name][$lang] );
                        if ( $compare1 !== $compare2 ) {
                            $labels[$name]['toTransfer'] = true;
                            unset( $labelsAlreadyInCore[$name] );
                            unset( $labelsMightBeAlreadyInCore[$name] );
                            continue 2;
                        } else {
                            if ( strtolower( $string ) === strtolower( $this->coreLabels[$name][$lang] ))
                                $labelsAlreadyInCore[$name][$lang] = true;
                            else
                                $labelsMightBeAlreadyInCore[$name][$lang] = [ 'custom' => $string, 'core' => $this->coreLabels[$name][$lang] ];
                        }
                    } else {
                        $labels[$name]['toTransfer'] = true;
                        unset( $labelsAlreadyInCore[$name] );
                        unset( $labelsMightBeAlreadyInCore[$name] );
                        continue 2;
                    }
                }
            }
        }

        $this->db->transactionStart();

        $nrLabelsTransfered = $nrTranslationsTransfered = 0;
        $labelsTransfered = [];
        $dbInsertionError = false;
        foreach ( $labels as $name => $v ) {
            if ( $v['toTransfer'] ) {
                if ( $existingLabel = $this->db->fetchOne( sprintf( 'SELECT * FROM syslanguagecustomlabels WHERE name = "%s"', $this->db->quote( $name )))) {
                    $labelGuid = $existingLabel['id'];
                } else $labelGuid = create_guid();
                $result = $this->db->query( sprintf( 'REPLACE INTO syslanguagecustomlabels SET id = "%s", name = "%s"', $labelGuid, $this->db->quote( $name )));
                if ( !$this->db->getAffectedRowCount( $result )) {
                    $dbInsertionError = true;
                    break;
                } else {
                    $nrLabelsTransfered++;
                    $labelsTransfered[] = $name;
                }
                foreach ( $v['translations'] as $lang => $string ) {
                    if ( $existingTranslation = $this->db->fetchOne( sprintf( 'SELECT * FROM syslanguagecustomtranslations WHERE syslanguagelabel_id = "%s"', $labelGuid ))) {
                        $translationGuid = $existingTranslation['id'];
                    } else $translationGuid = create_guid();
                    $result = $this->db->query( sprintf( 'REPLACE INTO syslanguagecustomtranslations SET id = "%s", syslanguagelabel_id = "%s", syslanguage = "%s", translation_default = "%s"', $translationGuid, $labelGuid, $this->db->quote( $lang ), $this->db->quote( $string ) ));
                    if ( !$this->db->getAffectedRowCount( $result )) {
                        $dbInsertionError = true;
                        break 2;
                    } else $nrTranslationsTransfered++;
                }
            }
        }
        if ( $dbInsertionError ) {
            $this->db->transactionRollback();
            return false;
        }

        $this->db->transactionCommit();

        return [
            $labelsTransfered,
            'countLabels' => $nrLabelsTransfered, 'countTranslations' => $nrTranslationsTransfered,
            'labelsNotTransfered' => [
                'alreadyInCore' => array_keys( $labelsAlreadyInCore ), 'mightAlreadyInCore' => $labelsMightBeAlreadyInCore
                # , 'mightWithDifferentNameInCore' => $labelsWithDifferentNameInCore
            ]
            # , 'debug' => $this->coreTranslationTexts
        ];

    }

}