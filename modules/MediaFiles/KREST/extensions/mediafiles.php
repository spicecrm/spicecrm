<?php

$app->group( '/module/MediaFiles', function() use ( $app ) {

    $app->post( '/fileupload', function() use ( $app ) {
        echo MediaFile::uploadMedia();
    } );

    $app->get( '/:id/file', function( $media_id ) use ( $app ) {
        global $sugar_config;
        $seed = BeanFactory::getBean( 'MediaFiles', $media_id );
        $seed->outputHeaders();
        readfile( $sugar_config['media_files_dir'] . '/' . $media_id );
    });

    $app->get( '/:id/file/th/:thumbSize', function( $mediaId, $thumbSize ) use ( $app ) {
        global $sugar_config;
        $seed = BeanFactory::getBean( 'MediaFiles', $mediaId );
        if ( !isset( $seed->width{0} ) or !isset( $seed->height{0} ))
            list( $seed->width, $seed->height ) = getimagesize( MediaFile::getMediaPath( $seed->id ));
        if ( $thumbSize > $seed->width ) $thumbSize = $seed->width;
        $targetSize = $thumbSize;
        if ( !MediaFile::widthExists( $targetSize, $seed->id ) ) {
            $bestSize = MediaFile::getBestThumbSize( $targetSize );
            if ( $targetSize != $bestSize ) {
                $app->redirectTo( 'th', array( 'id' => $mediaId, 'maxSize' => $bestSize ), $status = 302 );
                exit;
            } else
                $seed->generateThumb( $targetSize );
        }
        $seed->outputHeaders();
        readfile( $sugar_config['media_files_dir'] . '.thumbs/' . $mediaId . '.thumb' . $targetSize );
    })->name('th');

    $app->get( '/:id/file/mw/:maxWidth', function( $mediaId, $maxWidth ) use ( $app ) {
        global $sugar_config;
        $seed = BeanFactory::getBean( 'MediaFiles', $mediaId );
        if ( !isset( $seed->width{0} ) or !isset( $seed->height{0} ))
            list( $seed->width, $seed->height ) = getimagesize( MediaFile::getMediaPath( $seed->id ));
        if ( $maxWidth >= $seed->width ) {
            readfile( $sugar_config['media_files_dir'] . $mediaId );
        } else {
            $targetWidth = $maxWidth;
            if ( !MediaFile::widthExists( $targetWidth, $seed->id ) ) { #echo "not exists";ob_flush();exit;
                $bestWidth = MediaFile::getBestWidth( $targetWidth );
                if ( $targetWidth != $bestWidth ) {
                    $app->redirectTo( 'mw', array( 'id' => $mediaId, 'maxWidth' => $bestWidth ), $status = 302 );
                    exit;
                } else
                    $seed->generateWidth( $targetWidth );
            }
            $seed->outputHeaders();
            readfile( $sugar_config['media_files_dir'] . '.sizes/' . $mediaId . '.w' . $targetWidth );
        }
    })->name('mw');

    $app->get( '/:id/file/mwh/:maxWidth/:maxHeight', function( $mediaId, $maxWidth, $maxHeight ) use ( $app ) {
        global $sugar_config;
        $seed = BeanFactory::getBean( 'MediaFiles', $mediaId );
        if ( !isset( $seed->width{0} ) or !isset( $seed->height{0} ))
            list( $seed->width, $seed->height ) = getimagesize( MediaFile::getMediaPath( $seed->id ));
        if ( $maxWidth >= $seed->width and $maxHeight >= $seed->height ) {
            echo $seed->width;
            readfile( $sugar_config['media_files_dir'] . $mediaId );
        } else {
            $widthRatio = $maxWidth/$seed->width;
            $heightRatio = $maxHeight/$seed->height;
            $ratio = $widthRatio < $heightRatio ? $widthRatio : $heightRatio;
            $targetWidth = round( $seed->width*$ratio );
            if ( !MediaFile::widthExists( $targetWidth, $seed->id ) ) {
                $bestWidth = MediaFile::getBestWidth( $targetWidth );
                if ( $targetWidth != $bestWidth ) {
                    $app->redirectTo( 'mw', array( 'id' => $mediaId, 'maxWidth' => $bestWidth ), $status = 302 );
                    exit;
                } else
                    $seed->generateWidth( $targetWidth );
            }
            $seed->outputHeaders();
            readfile( $sugar_config['media_files_dir'] . '.sizes/' . $mediaId . '.w' . $targetWidth );
        }
    } );

    $app->delete( '', function() use ( $app ) {
        $params = json_decode( $app->request->getBody(), true );
    });

} );
