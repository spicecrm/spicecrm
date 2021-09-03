<?php

/*
 * Copyright notice
 * 
 * (c) 2016 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */
namespace SpiceCRM\modules\MediaFiles;

use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;

class MediaFile extends SugarBean {

    public $table_name = "mediafiles";
    public $object_name = "MediaFile";
    public $module_dir = 'MediaFiles';
    private $imageQualities = ['image/bmp' => true, 'image/gif' => null, 'image/jpeg' => 85, 'image/png' => 9, 'image/webp' => 80]; # for png: it´s not the quality, it´s the compression (lossless)
    private $imageFunctions = ['image/bmp' => 'bmp', 'image/gif' => 'gif', 'image/jpeg' => 'jpeg', 'image/png' => 'png', 'image/webp' => 'webp'];
    public $filetype, $width, $height, $hash, $name;

    public function __construct() {
        $this->makeSureDirsExist();
        parent::__construct();
    }

    public function bean_implements($interface) {
        switch($interface) {
            case 'ACL': return true;
        }
        return false;
    }

    public function get_summary_text() {
        return $this->name;
    }

    public function save( $check_notify = false, $fts_index_bean = true ) {


        if ( isset( $this->file[0])){
            $fileContent = base64_decode($this->file);
            $this->storeMedia($fileContent);
            $this->thumbnail = $this->createThumbnail(base64_decode( $this->file ), $this->filetype);
        }

        $returnOfSave = parent::save( $check_notify, $fts_index_bean );

        if ( isset( SpiceConfig::getInstance()->config['mediafiles']['cdnurl'][0])) {
            $chf = curl_init();
            curl_setopt($chf, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($chf, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($chf, CURLOPT_POSTFIELDS, $this->getBase64());
            curl_setopt($chf, CURLOPT_URL, SpiceConfig::getInstance()->config['mediafiles']['cdnurl']."/{$this->id}");
            curl_setopt($chf, CURLOPT_USERPWD, SpiceConfig::getInstance()->config['mediafiles']['cdnuser'] . ":" . SpiceConfig::getInstance()->config['mediafiles']['cdnsecret']);
            curl_setopt($chf, CURLOPT_POST, 1);
            $result = curl_exec($chf);
            curl_close($chf);
        }

        return $returnOfSave;
    }

    public function createThumbnail( $image, $mimetype ) {
        $mimetype = strtolower( $mimetype );

        if ( isset( $this->imageFunctions[$mimetype] )) {

            if (list($width, $height) = getimagesizefromstring($image)) {
                if ($width > $height) {
                    $newwidth = 600;
                    $newheight = round(600 * $height / $width);
                } else {
                    $newwidth = round(600 * $width / $height);
                    $newheight = 600;
                }

                $thumb = imagecreatetruecolor($newwidth, $newheight);
                $source = imagecreatefromstring($image);

                if ( $mimetype === 'image/png' ) {
                    imagealphablending( $thumb, false );
                    $color = imagecolortransparent( $thumb, imagecolorallocatealpha( $thumb, 0, 0, 0, 127 ));
                    imagefill( $thumb, 0, 0, $color );
                    imagesavealpha( $thumb, true );
                }

                imagecopyresized( $thumb, $source, 0, 0, 0, 0, $newwidth, $newheight, $width, $height );

                ob_start();
                $functionName = 'image'.$this->imageFunctions[$mimetype];
                $functionName( $thumb, null, $this->imageQualities[$mimetype] );
                $thumbnail = base64_encode( ob_get_contents() );
                ob_end_clean();
                imagedestroy( $thumb );

                return $thumbnail;
            }
        }

        return '';
    }

    private function getBase64(){
        return base64_encode( file_get_contents( self::getMediaPath( $this->id )));
    }

    // Use thumbnailSizeAllowed() to check if generating a thumbnail in a specific size is allowed, before calling this method.
    public function generateThumb( $destSize ) {
        $supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
        if ( in_array( $this->filetype, $supportedImageTypes )) {
            if ( !isset( $this->width[0]) or !isset( $this->height[0]))
                list( $origWidth, $origHeight ) = getimagesize( self::getMediaPath( $this->id ));
            else {
                $origWidth = $this->width;
                $origHeight = $this->height;
            }
            if ( $origWidth > $origHeight ) {
                $borderY = 0;
                $cutHeight = $origHeight;
                $memmy = $origHeight / 0.75;
                if ( $memmy < $origWidth ) {
                    $borderX = round(( $origWidth - $memmy ) / 2);
                    $cutWidth = round( $memmy );
                } else {
                    $borderX = 0;
                    $cutWidth = $origWidth;
                }
            } elseif ( $origWidth < $origHeight ) {
                $borderX = 0;
                $cutWidth = $origWidth;
                $memmy = $origWidth / 0.75;
                if ( $memmy < $origHeight ) {
                    $borderY = round(( $origHeight - $memmy ) / 2);
                    $cutHeight = round( $memmy );
                } else {
                    $borderY = 0;
                    $cutHeight = $origHeight;
                }
            } else {
                $borderX = $borderY = 0;
                $cutWidth = $cutHeight = $origWidth; // or $origHeight, its the same value
            }
            $thumb = imagecreatetruecolor( $destSize, $destSize );
            $functionName = 'imagecreatefrom'.$this->imageFunctions[$this->filetype];
            $source = $functionName( self::getMediaPath( $this->id ));

            if ( $this->filetype === 'image/png' ) {
                imagealphablending( $thumb, false );
                $color = imagecolortransparent( $thumb, imagecolorallocatealpha( $thumb, 0, 0, 0, 127 ) );
                imagefill( $thumb, 0, 0, $color );
                imagesavealpha( $thumb, true );
            }

            imagecopyresampled( $thumb, $source, 0, 0, $borderX, $borderY, $destSize, $destSize, $cutWidth, $cutHeight );

            $functionName = 'image'.$this->imageFunctions[$this->filetype];
            $functionName( $thumb, self::getFolderOfThumbs().$this->id.'.thumb'.$destSize, $this->imageQualities[$this->filetype] );

            imagedestroy( $thumb );
            return true;
        } else
            return false;
    }

    static function thumbExists( $size, $mediaId ) {
        return file_exists( self::getFolderOfThumbs().$mediaId.'.thumb'.$size );
    }

    static function widthExists( $width, $mediaId ) {
        return file_exists( self::getFolderOfSizes().$mediaId.'.w'.$width );
    }

    function thumbSizeAllowed( $size ) {

        if (( !isset( SpiceConfig::getInstance()->config['media_files_thumb_sizes'] ) or ( count( SpiceConfig::getInstance()->config['media_files_thumb_sizes'] ) === 0 ))
            and !isset( SpiceConfig::getInstance()->config['media_files_thumb_sizes_auto_step'] )) return true;
        if ( isset( SpiceConfig::getInstance()->config['media_files_thumb_sizes'] ) and in_array( $size, SpiceConfig::getInstance()->config['media_files_thumb_sizes'] )) return true;
        if ( !isset( SpiceConfig::getInstance()->config['media_files_thumb_sizes_auto_step'] )) return false;
        if ( isset( SpiceConfig::getInstance()->config['media_files_thumb_sizes'] ) and count( SpiceConfig::getInstance()->config['media_files_thumb_sizes'] )) {
            if ( ( $size - SpiceConfig::getInstance()->config['media_files_thumb_sizes'][count(SpiceConfig::getInstance()->config['media_files_thumb_sizes'])-1] ) % SpiceConfig::getInstance()->config['media_files_thumb_sizes_auto_step'] === 0 ) return true;
        } else {
            if ( $size % SpiceConfig::getInstance()->config['media_files_thumb_sizes_auto_step'] === 0 ) return true;
        }
        return false;
    }

    public static function widthAllowed( $width ) {

        if (( !isset( SpiceConfig::getInstance()->config['media_files_image_widths'] ) or ( count( SpiceConfig::getInstance()->config['media_files_image_widths'] ) === 0 ))
            and !isset( SpiceConfig::getInstance()->config['media_files_image_widths_auto_step'] )) return true;
        if ( isset( SpiceConfig::getInstance()->config['media_files_image_widths'] ) and in_array( $width, SpiceConfig::getInstance()->config['media_files_image_widths'] )) return true;
        if ( !isset( SpiceConfig::getInstance()->config['media_files_image_widths_auto_step'] )) return false;
        if ( isset( SpiceConfig::getInstance()->config['media_files_image_widths'] ) and count( SpiceConfig::getInstance()->config['media_files_image_widths'] )) {
            if ( ( $width - SpiceConfig::getInstance()->config['media_files_image_widths'][count(SpiceConfig::getInstance()->config['media_files_image_widths'])-1] ) % SpiceConfig::getInstance()->config['media_files_image_widths_auto_step'] === 0 ) return true;
        } else {
            if ( $width % SpiceConfig::getInstance()->config['media_files_image_widths_auto_step'] === 0 ) return true;
        }
        return false;
    }

    public static function getBestWidth( $width ) {
        if ( self::widthAllowed( $width )) return $width;
        else return self::getNextLargestWidth( $width );
    }

    public static function getNextLargestWidth( $width ) {

        if ( isset( SpiceConfig::getInstance()->config['media_files_image_widths'] ) ) {
            sort( SpiceConfig::getInstance()->config['media_files_image_widths'] );
            foreach ( SpiceConfig::getInstance()->config['media_files_image_widths'] as $v )
                if ( $v > $width ) return $v;
        }
        if ( @SpiceConfig::getInstance()->config['media_files_image_widths_auto_step'] > 0 ) {
            $start = SpiceConfig::getInstance()->config['media_files_image_widths_auto_step'];
            if ( count( @SpiceConfig::getInstance()->config['media_files_image_widths'] ))
                $start += SpiceConfig::getInstance()->config['media_files_image_widths'][count(SpiceConfig::getInstance()->config['media_files_image_widths'])-1];
            # for ( $x = $start; $x < $this->width; $x += \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['media_files_image_widths_auto_step'] )
            #    if ( $x > $width ) return $x;
            for ( $x = $start; $x < $width; $x += SpiceConfig::getInstance()->config['media_files_image_widths_auto_step'] );
            return $x;
        }
        return $width; # $this->width;
    }

    public static function getBestThumbSize( $size ) {
        if ( self::thumbSizeAllowed( $size )) return $size;
        else return self::getNextLargestThumbSize( $size ); # else return self::getNextLargestThumbSize( $size );
    }

    public static function getNextLargestThumbSize( $size ) {

        if ( isset( SpiceConfig::getInstance()->config['media_files_thumb_sizes'] ) ) {
            sort( SpiceConfig::getInstance()->config['media_files_thumb_sizes'] );
            foreach ( SpiceConfig::getInstance()->config['media_files_thumb_sizes'] as $v )
                if ( $v > $size ) return $v;
        }
        if ( @SpiceConfig::getInstance()->config['media_files_thumb_sizes_auto_step'] > 0 ) {
            $start = SpiceConfig::getInstance()->config['media_files_thumb_sizes_auto_step'];
            if ( count( @SpiceConfig::getInstance()->config['media_files_thumb_sizes'] ))
                $start += SpiceConfig::getInstance()->config['media_files_thumb_sizes'][count(SpiceConfig::getInstance()->config['media_files_thumb_sizes'])-1];
            #for ( $x = $start; $x < $this->width; $x += \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['media_files_thumb_sizes_auto_step'] )
            #    if ( $x > $size ) return $x;
            for ( $x = $start; $x < $size; $x += SpiceConfig::getInstance()->config['media_files_thumb_sizes_auto_step'] );
            return $x;
        }
        return $size; # $this->width;
    }

    public function generateWidth( $requestedWidth ) {
        return $this->_generateSize( $requestedWidth, null );
    }
    public function generateHeight( $requestedHeight ) {
        return $this->_generateSize( null, $requestedHeight );
    }
    public function generateSize( $requestedWidth, $requestedHeight ) {
        $this->_generateSize( $requestedWidth, $requestedHeight );
    }

    private function _generateSize( $requestedWidth, $requestedHeight ) {

        $supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

        if ( !in_array( $this->filetype, $supportedImageTypes )) return false;

        if ( !isset( $this->width[0]) or !isset( $this->height[0]))
            list( $origWidth, $origHeight ) = getimagesize( self::getMediaPath( $this->id ));
        else {
            $origWidth = $this->width;
            $origHeight = $this->height;
        }

        if ( isset( $requestedWidth ) and !isset( $requestedHeight )) {
            if ( $origWidth > $requestedWidth )
                $requestedHeight = round( $origHeight / ( $origWidth / $requestedWidth ));
        }
        if ( isset( $requestedHeight ) and !isset( $requestedWidth )) {
            if ( $origHeight > $requestedHeight )
                $requestedWidth = round($origWidth / ($origHeight / $requestedHeight));
        }

        $filename = self::getFolderOfSizes() . '/' . $this->id . '.w' . $requestedWidth;
        $image = imagecreatetruecolor( $requestedWidth, $requestedHeight );
        $functionName = 'imagecreatefrom'.$this->imageFunctions[$this->filetype];
        $source = $functionName( self::getMediaPath( $this->id ));

        if ( $this->filetype === 'image/png' ) {
            imagealphablending( $image, false );
            $color = imagecolortransparent( $image, imagecolorallocatealpha( $image, 0, 0, 0, 127 ) );
            imagefill( $image, 0, 0, $color );
            imagesavealpha( $image, true );
        }

        imagecopyresampled( $image, $source, 0, 0, 0, 0, $requestedWidth, $requestedHeight, $origWidth, $origHeight );

        $functionName = 'image'.$this->imageFunctions[$this->filetype];
        $functionName( $image, $filename );

        imagedestroy( $image );

        return $filename;

    }

    function outputHeaders() {
        while ( ob_get_level() && @ob_end_clean() );
        # ??? header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        //header("Pragma: public");
        //header("Cache-Control: maxage=1"); // todo?!
        header('Content-type: image/'.$this->filetype );
        header("Content-Disposition: inline; filename=\"" . $this->id . '.' . $this->filetype . "\";");
        #header("Content-Length: " . filesize( self::getMediaPath( $this->id ))); // todo
        //header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 2592000 )); // 1 month
        if ( isset( $this->hash[0])) header( 'ETag: "'.$this->hash.'"' );
    }

    /**
     * returns the original file base64 encoded
     *
     * @return string
     */
    public function deliverOriginalBase64() {
        $data = file_get_contents(self::getMediaPath( $this->id ));
        return base64_encode($data);
    }

    public function deliverOriginal() {
        $this->outputHeaders();
        readfile( self::getMediaPath( $this->id ));
        exit;
    }

    public function deliverSize( $size ) {
        $this->outputHeaders();
        readfile( self::getFolderOfSizes() . '/' . $this->id . ".w" . $size );
        exit;
    }

    public function deliverThumb( $size ) {
        $this->outputHeaders();
        readfile( self::getFolderOfThumbs() . '/' .$this->id . ".thumb" . $size );
        exit;
    }

    public static function deleteMedia( $mediaId ) {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $result = $db->query( 'UPDATE mediafiles SET deleted = 1 WHERE id=\''.$mediaId.'\'' . ( !$current_user->is_admin ? ' AND user_id=\'' . $current_user->id . '\'' : '' ));
        if ( $db->getAffectedRowCount( $result ))
            if ( $db->getAffectedRowCount( $result )) self::_deleteMediaPhysical( $mediaId );
    }

    private static function _deleteMediaPhysical( $mediaId ) {
        if ( @SpiceConfig::getInstance()->config['media_files_no_trash'] ) unlink( self::getMediaPath( $mediaId ));
        else rename( self::getMediaPath( $mediaId ), self::getFolderOfTrash().$mediaId.'.'.microtime() );
        self::deleteVariants( $mediaId );
    }

    private static function deleteVariants( $mediaId ) {
        if ( is_dir( $memmy = self::getFolderOfThumbs())) array_map( 'unlink', glob( $memmy.$mediaId.'.*' ));
        if ( is_dir( $memmy = self::getFolderOfSizes())) array_map( 'unlink', glob( $memmy.$mediaId.'.*' ));
    }

    public function storeMedia( $file )
    {
        file_put_contents( self::getMediaPath( ( $this->id ) ), $file );
        $this->filesize = strlen( $file );
        $this->hash = md5($file);
        list( $this->width, $this->height ) = getimagesizefromstring($file);
        self::deleteVariants( $this->id );
    }

    public static function getMediaPath( $mediaId ) {
        return SpiceConfig::getInstance()->config['media_files_dir'] . $mediaId;
    }

    public static function getFolderOfMedia() {
        return isset( SpiceConfig::getInstance()->config['media_files_dir'][0]) ? SpiceConfig::getInstance()->config['media_files_dir'] : 'media/';
    }

    public static function getFolderOfThumbs() {
        return self::getFolderOfMedia() . '.thumbs/';
    }

    public static function getFolderOfSizes() {
        return self::getFolderOfMedia() . '.sizes/';
    }

    public static function getFolderOfTrash() {
        return self::getFolderOfMedia() . '.trash/';
    }

    private function makeSureDirsExist() {
        $error = false;
        if ( !is_dir( $memmy = self::getFolderOfMedia()) and !mkdir( $memmy, 0770 ) ) {
            LoggerManager::getLogger()->fatal( 'MediaFiles: mkdir() failed! Cannot create not yet existing media directory.' );
            $error = true;
        } else {
            if ( !is_dir( $memmy = self::getFolderOfThumbs()) and !mkdir( $memmy, 0770 ) ) {
                LoggerManager::getLogger()->fatal( 'MediaFiles: mkdir() failed! Cannot create not yet existing thumbs directory.' );
                $error = true;
            }
            if ( !is_dir( $memmy = self::getFolderOfSizes()) and !mkdir( $memmy, 0770 ) ) {
                LoggerManager::getLogger()->fatal( 'MediaFiles: mkdir() failed! Cannot create not yet existing sizes directory.' );
                $error = true;
            }
            if ( !is_dir( $memmy = self::getFolderOfTrash()) and !mkdir( $memmy, 0770 ) ) {
                LoggerManager::getLogger()->fatal( 'MediaFiles: mkdir() failed! Cannot create not yet existing trash directory.' );
                $error = true;
            }
        }
        if ( $error ) sugar_die( 'Error with media file directory/directories. Please refer to spicecrm.log (and error.log) for details.' );
    }

    public function fill_in_additional_detail_fields() {
        parent::fill_in_additional_detail_fields();
        if ( empty( $this->thumbnail )) {
            if (!self::thumbExists( 600, $this->id) && file_exists(self::getMediaPath( $this->id ))) $this->generateThumb( 600 );
            $this->thumbnail = base64_encode( file_get_contents( self::getFolderOfThumbs() . '/' . $this->id . '.thumb' . 600 ));
        }
    }

}
