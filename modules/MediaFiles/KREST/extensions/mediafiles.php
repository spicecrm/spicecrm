<?php

$app->group( '/module/MediaFiles', function() use ( $app ) {

    $app->post( '/fileupload', function() use ( $app ) {
        echo MediaFile::uploadMedia();
    });

    $app->post('/{mediaId}', function( $req, $res, $args ) use ( $app ) {
        global $db;
        $KRESTModuleHandler = new KRESTModuleHandler( $app );

        //$postBody = $body = $app->request->getBody();
        //$postParams = $app->request->get();
        //$postBodyArray = json_decode( $postBody, true );
        $params = $req->getParams();

        # if a category is provided
        if ( $params['category']{0} ) {
            # if the category is provided as guid
            if ( preg_match('#^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$#i', $params['category'] )) {
                # if the category doesn´t exist: set it to null
                if ( ! $db->getOne( sprintf(  'SELECT count(*) FROM mediacategories WHERE deleted = 0 AND id = "%s"', $db->quote( $params['category'] )))) {
                    $params['category'] = null;
                }
            } else {
                # if the category is provided as path like 'continents\europe\austria':
                # determine the id for the category and use it instead of the path.
                # if the path is wrong (one ore more categories doesn´t exist) set the category to null.
                $parentCategory = null;
                foreach ( explode('\\', $params['category'] ) as $v ) {
                    if ( $category = $db->fetchOne( sprintf(  'SELECT * FROM mediacategories WHERE deleted = 0 AND name = "%s" AND parent_id '.( !isset( $parentCategory{0} ) ? 'IS NULL':'= "'.$parentCategory.'"' ), $db->quote( $v )))) {
                        $parentCategory = $category['id'];
                    } else break;
                }
                $params['category'] = $category ? $category['id']:null;
            }
        }

        $thisBean = $KRESTModuleHandler->add_bean( 'MediaFiles', $args['mediaId'], $params );

        echo json_encode( $thisBean );
    });

    $app->get( '/{mediaId}/file', function( $req, $res, $args ) use ( $app ) {
        $seed = BeanFactory::getBean( 'MediaFiles', $args['mediaId'] );
        $seed->deliverOriginal();
    });

    $app->get( '/{mediaId}/file/th/{thumbSize}', function( $req, $res, $args ) use ( $app ) {
        $thumbSize = $args['thumbSize'];
        $seed = BeanFactory::getBean( 'MediaFiles', $args['mediaId'] );
        if ( !isset( $seed->width{0} ) or !isset( $seed->height{0} ))
            list( $seed->width, $seed->height ) = getimagesize( MediaFile::getMediaPath( $seed->id ));
        if ( $thumbSize > $seed->width ) $thumbSize = $seed->width;
        $targetSize = $thumbSize;
        if ( ! MediaFile::widthExists( $targetSize, $seed->id ) ) {
            $bestSize = MediaFile::getBestThumbSize( $targetSize );
            if ( $targetSize != $bestSize ) {
                # Kepp this line! It might be needed later when caching will be implemented.
                # $app->redirectTo( 'th', array( 'id' => $mediaId, 'maxSize' => $bestSize ), $status = 302 );
                $seed->generateThumb( $bestSize );
                $seed->deliverThumb( $bestSize );
            } else {
                $seed->generateThumb( $targetSize );
                $seed->deliverThumb( $targetSize );
            }
        }
        $seed->deliverThumb( $targetSize );
    }); // ->name('th');

    $app->get( '/{mediaId}/file/mw/{maxWidth}', function( $req, $res, $args ) use ( $app ) {
        $seed = BeanFactory::getBean( 'MediaFiles', $args['mediaId'] );
        if ( !isset( $seed->width{0} ) or !isset( $seed->height{0} ))
            list( $seed->width, $seed->height ) = getimagesize( MediaFile::getMediaPath( $seed->id ));
        if ( $args['maxWidth'] >= $seed->width ) {
            $seed->deliverOriginal();
        } else {
            $targetWidth = $args['maxWidth'];
            if ( ! MediaFile::widthExists( $targetWidth, $seed->id )) {
                $bestWidth = MediaFile::getBestWidth( $targetWidth );
                if ( $bestWidth >= $seed->width ) {
                    $seed->deliverOriginal();
                } elseif ( $targetWidth != $bestWidth ) {
                    # Kepp this line! It might be needed later when caching will be implemented.
                    # $app->redirectTo( 'mw', array( 'id' => $mediaId, 'maxWidth' => $bestWidth ), $status = 302 );
                    #echo $bestWidth;
                    $seed->generateWidth( $bestWidth );
                    $seed->deliverSize( $bestWidth );
                } else {
                    $seed->generateWidth( $targetWidth );
                    $seed->deliverSize( $targetWidth );
                }
            } else {
                $seed->deliverSize( $targetWidth );
            }
        }
    }); // ->name('mw');

    $app->get( '/{mediaId}/file/mwh/{maxWidth}/{maxHeight}', function( $req, $res, $args ) use ( $app ) {
        $seed = BeanFactory::getBean( 'MediaFiles', $args['mediaId'] );
        if ( !isset( $seed->width{0} ) or !isset( $seed->height{0} ))
            list( $seed->width, $seed->height ) = getimagesize( MediaFile::getMediaPath( $seed->id ));
        if ( $args['maxWidth'] >= $seed->width and $args['maxHeight'] >= $seed->height ) {
            $seed->deliverOriginal();
        } else {
            $widthRatio = $args['maxWidth']/$seed->width;
            $heightRatio = $args['maxHeight']/$seed->height;
            $ratio = $widthRatio < $heightRatio ? $widthRatio : $heightRatio;
            $targetWidth = round( $seed->width*$ratio );
            if ( ! MediaFile::widthExists( $targetWidth, $seed->id )) {
                $bestWidth = MediaFile::getBestWidth( $targetWidth );
                if ( $bestWidth >= $seed->width ) {
                    $seed->deliverOriginal();
                } elseif ( $targetWidth != $bestWidth ) {
                    # Kepp this line! It might be needed later when caching will be implemented.
                    # $app->redirectTo( 'mw', array( 'id' => $mediaId, 'maxWidth' => $bestWidth ), $status = 302 );
                    $seed->generateWidth( $bestWidth );
                    $seed->deliverSize( $bestWidth );
                } else {
                    $seed->generateWidth( $targetWidth );
                    $seed->deliverSize( $targetWidth );
                }
            } else {
                $seed->deliverSize( $targetWidth );
            }
        }
    } );

    $app->delete( '',  function( $req, $res, $args ) use ( $app ) {
        //$params = json_decode( $app->request->getBody(), true );
        $params = $req->getParams();
    });

} );