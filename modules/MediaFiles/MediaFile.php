<?php

/*
 * Copyright notice
 * 
 * (c) 2016 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

class MediaFile extends SugarBean {

    public $table_name = "mediafiles";
    public $object_name = "MediaFile";
    public $module_dir = 'MediaFiles';
    public $unformated_numbers = true;
    public $imageQualities = array( 'bmp' => true, 'gif' => null, 'jpg' => 85, 'jpeg' => 85, 'png' => 9, 'webp' => 80 ); # for png: it´s not the quality, it´s the compression (lossless)
    public $imageFunctions = array( 'bmp' => 'bmp', 'gif' => 'gif', 'jpg' => 'jpeg', 'jpeg' => 'jpeg', 'png' => 'png', 'webp' => 'webp' );

    public function __construct()
    {
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

    // Use thumbnailSizeAllowed() to check if generating a thumbnail in a specific size is allowed, before calling this method.
    public function generateThumb( $destSize ) {
        global $sugar_config;
        $supportedImageTypes = ['jpeg', 'png', 'gif', 'bmp'];
        if ( in_array( $this->filetype, $supportedImageTypes )) {
            if ( !isset( $this->width{0} ) or !isset( $this->height{0} ))
                list( $origWidth, $origHeight ) = getimagesize( self::getMediaPath( $this->id ));
            else {
                $origWidth = $this->width;
                $origHeight = $this->height;
            }
            if ( $origWidth > $origHeight ) {
                $borderY = 0;
                $cutHeight = $origHeight;
                $dummy = $origHeight / 0.75;
                if ( $dummy < $origWidth ) {
                    $borderX = round(( $origWidth - $dummy ) / 2);
                    $cutWidth = round( $dummy );
                } else {
                    $borderX = 0;
                    $cutWidth = $origWidth;
                }
            } elseif ( $origWidth < $origHeight ) {
                $borderX = 0;
                $cutWidth = $origWidth;
                $dummy = $origWidth / 0.75;
                if ( $dummy < $origHeight ) {
                    $borderY = round(( $origHeight - $dummy ) / 2);
                    $cutHeight = round( $dummy );
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

            if ( $this->filetype === 'png' ) {
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
        global $sugar_config;
        if (( !isset( $sugar_config['media_files_thumb_sizes'] ) or ( count( $sugar_config['media_files_thumb_sizes'] ) === 0 ))
            and !isset( $sugar_config['media_files_thumb_sizes_auto_step'] )) return true;
        if ( isset( $sugar_config['media_files_thumb_sizes'] ) and in_array( $size, $sugar_config['media_files_thumb_sizes'] )) return true;
        if ( !isset( $sugar_config['media_files_thumb_sizes_auto_step'] )) return false;
        if ( isset( $sugar_config['media_files_thumb_sizes'] ) and count( $sugar_config['media_files_thumb_sizes'] )) {
            if ( ( $size - $sugar_config['media_files_thumb_sizes'][count($sugar_config['media_files_thumb_sizes'])-1] ) % $sugar_config['media_files_thumb_sizes_auto_step'] === 0 ) return true;
        } else {
            if ( $size % $sugar_config['media_files_thumb_sizes_auto_step'] === 0 ) return true;
        }
        return false;
    }

    function widthAllowed( $width ) {
        global $sugar_config;
        if (( !isset( $sugar_config['media_files_image_widths'] ) or ( count( $sugar_config['media_files_image_widths'] ) === 0 ))
            and !isset( $sugar_config['media_files_image_widths_auto_step'] )) return true;
        if ( isset( $sugar_config['media_files_image_widths'] ) and in_array( $width, $sugar_config['media_files_image_widths'] )) return true;
        if ( !isset( $sugar_config['media_files_image_widths_auto_step'] )) return false;
        if ( isset( $sugar_config['media_files_image_widths'] ) and count( $sugar_config['media_files_image_widths'] )) {
            if ( ( $width - $sugar_config['media_files_image_widths'][count($sugar_config['media_files_image_widths'])-1] ) % $sugar_config['media_files_image_widths_auto_step'] === 0 ) return true;
        } else {
            if ( $width % $sugar_config['media_files_image_widths_auto_step'] === 0 ) return true;
        }
        return false;
    }

    function getBestWidth( $width ) {
        if ( self::widthAllowed( $width )) return $width;
        else return self::getNextLargestWidth( $width );
    }

    function getNextLargestWidth( $width ) {
        global $sugar_config;
        if ( isset( $sugar_config['media_files_image_widths'] ) ) {
            sort( $sugar_config['media_files_image_widths'] );
            foreach ( $sugar_config['media_files_image_widths'] as $v )
                if ( $v > $width ) return $v;
        }
        if ( @$sugar_config['media_files_image_widths_auto_step'] > 0 ) {
            $start = $sugar_config['media_files_image_widths_auto_step'];
            if ( count( @$sugar_config['media_files_image_widths'] ))
                $start += $sugar_config['media_files_image_widths'][count($sugar_config['media_files_image_widths'])-1];
            # for ( $x = $start; $x < $this->width; $x += $sugar_config['media_files_image_widths_auto_step'] )
            #    if ( $x > $width ) return $x;
            for ( $x = $start; $x < $width; $x += $sugar_config['media_files_image_widths_auto_step'] );
            return $x;
        }
        return $width; # $this->width;
    }

    function getBestThumbSize( $size ) {
        if ( self::thumbSizeAllowed( $size )) return $size;
        else return self::getNextLargestThumbSize( $size ); # else return self::getNextLargestThumbSize( $size );
    }

    function getNextLargestThumbSize( $size ) {
        global $sugar_config;
        if ( isset( $sugar_config['media_files_thumb_sizes'] ) ) {
            sort( $sugar_config['media_files_thumb_sizes'] );
            foreach ( $sugar_config['media_files_thumb_sizes'] as $v )
                if ( $v > $size ) return $v;
        }
        if ( @$sugar_config['media_files_thumb_sizes_auto_step'] > 0 ) {
            $start = $sugar_config['media_files_thumb_sizes_auto_step'];
            if ( count( @$sugar_config['media_files_thumb_sizes'] ))
                $start += $sugar_config['media_files_thumb_sizes'][count($sugar_config['media_files_thumb_sizes'])-1];
            #for ( $x = $start; $x < $this->width; $x += $sugar_config['media_files_thumb_sizes_auto_step'] )
            #    if ( $x > $size ) return $x;
            for ( $x = $start; $x < $size; $x += $sugar_config['media_files_thumb_sizes_auto_step'] );
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

        $supportedImageTypes = ['jpeg', 'png', 'gif', 'bmp'];

        if ( !in_array( $this->filetype, $supportedImageTypes )) return false;

        if ( !isset( $this->width{0} ) or !isset( $this->height{0} ))
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

        $filename = self::getFolderOfSizes() . $this->id . '.w' . $requestedWidth;
        $image = imagecreatetruecolor( $requestedWidth, $requestedHeight );
        $functionName = 'imagecreatefrom'.$this->filetype;
        $source = $functionName( self::getMediaPath( $this->id ));

        if ( $this->filetype === 'png' ) {
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
        global $sugar_config;
        while ( ob_get_level() && @ob_end_clean() );
        # ??? header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        //header("Pragma: public");
        //header("Cache-Control: maxage=1"); // todo?!
        header('Content-type: image/'.$this->filetype );
        header("Content-Disposition: inline; filename=\"" . $this->id . '.' . $this->filetype . "\";");
        #header("Content-Length: " . filesize( self::getMediaPath( $this->id ))); // todo
        //header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 2592000 )); // 1 month
        if ( isset( $this->hash{0} )) header( 'ETag: "'.$this->hash.'"' );
    }

    public static function deleteMedia( $mediaId ) {
        global $current_user, $db;
        $db->query( 'UPDATE mediafiles SET deleted = 1 WHERE id="'.$mediaId.'"' . ( !$current_user->is_admin ? ' AND user_id="' . $current_user->id . '"' : '' ));
        if ( $db->getAffectedRowCount() )
            if ( $db->getAffectedRowCount() ) self::_deleteMediaPhysical( $mediaId );
    }

    public static function cancelUpload( $mediaId ) {
        global $current_user, $db;
        $db->query( 'DELETE FROM mediafiles WHERE id="'.$mediaId.'" AND upload_completed <> 1'.( !$current_user->is_admin ? ' AND user_id="' . $current_user->id . '"' : '' ));
        if ( $db->getAffectedRowCount() ) self::_deleteMediaPhysical( $mediaId );
    }

    private static function _deleteMediaPhysical( $mediaId ) {
        if ( isset( $sugar_config['media_files_trash_dir']{0} ))
            rename( self::getMediaPath( $mediaId ), self::getFolderOfTrash().$mediaId.'.'.microtime() );
        else
            unlink( self::getMediaPath( $mediaId ));
        array_map( 'unlink', glob( self::getFolderOfThumbs().$mediaId.'.*' ));
        array_map( 'unlink', glob( self::getFolderOfSizes().$mediaId.'.*' ));
    }

    public static function completeUpload( $mediaId ) {
        global $current_user, $db;
        $db->query( 'UPDATE mediafiles SET upload_completed = 1 WHERE id="'.$mediaId.'"'.( !$current_user->is_admin ? ' AND user_id="'.$current_user->id.'"':'' ));
        return $db->getAffectedRowCount() == 1;
    }

    // public static deleteUnfinishedUploads()

    public static function uploadMedia() {
        $upload_file = new UploadFile( 'file' );
        if ( isset( $_FILES['file'] )) { // && $upload_file->confirm_upload() ) {
            $upload = new MediaFile();
            list( $mediatype,  $upload->filetype ) = explode( '/', $upload_file->getMime( $_FILES['file'] ));
            $upload->mediatype = $mediatype === 'image' ? 1:0; // todo
            $upload->filesize = $_FILES['file']['size'];
            $upload->hash = md5_file( $_FILES['file']['tmp_name'] );
            list( $upload->width, $upload->height  ) = getimagesize( $_FILES['file']['tmp_name'] );
            $mediaId = $upload->save();
            rename( $_FILES['file']['tmp_name'], self::getMediaPath( $mediaId ));
        }
        $filedata = $upload->get_list_view_data();
        foreach ( $filedata as $k => $v ) $filedata[strtolower($k)] = $v;
        $filedata['id'] = $filedata['ID'];
        return json_encode( $filedata );
    }

    public static function getMediaPath( $mediaId ) {
        return $GLOBALS['sugar_config']['media_files_dir'] . $mediaId;
    }

    public static function getFolderOfThumbs() {
        return $GLOBALS['sugar_config']['media_files_dir'] . '.thumbs/';
    }

    public static function getFolderOfSizes() {
        return $GLOBALS['sugar_config']['media_files_dir'] . '.sizes/';
    }

    public static function getFolderOfTrash() {
        return $GLOBALS['sugar_config']['media_files_dir'] . '.trash/';
    }

}
