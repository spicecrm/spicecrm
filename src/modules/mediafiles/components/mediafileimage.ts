/**
 * @module ModuleMediaFiles
 */
import { Component, OnChanges, Input, ElementRef } from '@angular/core';
import {mediafiles} from '../../../services/mediafiles.service';
import { modal } from '../../../services/modal.service';

@Component({
    selector: 'media-file-image',
    templateUrl: '../templates/mediafileimage.html',
    providers: [ mediafiles ],
    styles: [
        'img:hover { cursor: pointer; }'
    ]
})
export class MediaFileImage implements OnChanges {

    /**
     * The GUID of the media file.
     */
    @Input() public media_id: string;

    /**
     * Variant of the image:
     *
     * th ... Thumbnail
     * mw ... Image, maximal width is given
     * mwh ... Image, maximal width and maximal height is given
     */
    @Input() public variant: string;

    /**
     * Specific pixel size, in case it is a thumbnail (square).
     */
    @Input() public size: number = null;

    /**
     * Specific pixel width (in case it is a image, not a thumbnail).
     */
    @Input() public width: number = null;

    /**
     * Specific pixel height (in case it is a image, not a thumbnail).
     */
    @Input() public height: number = null;

    /**
     * Ability to specify css classes for the image tag.
     */
    @Input() public classImage = '';

    /**
     * Ability to specify css classes for the surrounding span tag.
     */
    @Input() public classOuter = '';

    /**
     * Ability to horizontal align the surrounding span tag.
     */
    @Input() public align = '';

    /**
     * The pixel width of the frame within the image can find space (in case it is a image, not a thumbnail).
     * When not specified it will get determined by measuring the parent element of the component.
     */
    @Input() public frameWidth: number = null;

    /**
     * The pixel height of the frame within the image can find space (in case it is a image, not a thumbnail).
     * When not specified it will get determined by measuring the parent element of the component.
     */
    @Input() public frameHeight: number = null;

    /**
     * The pixel size of the frame within the thumbnail can find space.
     * When not specified it will get determined by measuring the parent element of the component.
     */
    @Input() public frameSize: number = null;

    /**
     * Display the image tag inline or as block.
     */
    @Input() public displayInline = false;

    /**
     * Title for the image tag.
     */
    @Input() public title = '';

    /**
     * Alternate text of the image.
     */
    @Input() public alttext = '';

    /**
     * The url for the image tag.
     */
    public imageUrl: any;

    /**
     * CSS width and height of the image element (pixel).
     */
    public dimensions = { width: undefined, height: undefined };

    /**
     * For ngOnChanges, indicator for first change.
     */
    public isFirstChange = true;

    /**
     * Holds the initial value of "variant" (the component does not accept later changes of the input value "variant").
     */
    public variantStatic: string;

    /**
     * Holds the (last) media id to notice possible change of it.
     */
    public lastMediaId = '';

    public withFrameHeight = true;

    constructor( public mediafiles: mediafiles, public elRef: ElementRef, public modal: modal ) {}

    public ngOnChanges() {

        // The component does not accept later changes of the input value "variant".
        if ( this.isFirstChange ) {
            this.isFirstChange = false;
            this.variantStatic = this.variant;
        }

        if ( this.variantStatic === 'mw' || this.variantStatic === 'mwh' ) {

            // Set the CSS width and CSS height for the image tag:
            if ( this.width != null ) this.dimensions.width = this.width;
            if ( this.height != null ) this.dimensions.height = this.height;

            // Set the frame dimensions:
            if ( this.frameWidth === null ) this.frameWidth = this.determineMaxWidthOfImage();
            if ( this.variantStatic === 'mwh' && this.frameHeight === null ) this.frameHeight = this.determineMaxHeightOfImage();
            if ( this.variantStatic === 'mw' ) this.withFrameHeight = false;

        } else { // this.variant === 'th'

            // Set the CSS width and CSS height for the image tag:
            if ( this.size != null ) this.dimensions.height = this.dimensions.width = this.size;
            // Set the frame dimension:
            if ( this.frameSize === null ) this.frameSize = this.determineMaxWidthOfImage();

        }

        if ( this.media_id ) {
            if ( this.lastMediaId !== this.media_id ) this.showImage();
            else this.imageUrl = '';
        }

    }

    /**
     * Retrieve and show the image/thumbnail.
     */
    public showImage(): void {
        let sizes4variant;
        switch ( this.variantStatic ) {
            case 'mw':
                sizes4variant = this.frameWidth;
                break;
            case 'mwh':
                sizes4variant = this.frameWidth + '/' + this.frameHeight;
                break;
            case 'th':
                sizes4variant = this.frameSize;
        }
        this.mediafiles.getImageVariant( this.media_id, this.variantStatic + '/' + sizes4variant ).subscribe( url => {
            this.imageUrl = url;
        } );
    }

    /**
     * Does the CSS to display the image inline or as block.
     */
    get styleDisplay() {
        return this.displayInline ? 'inline-block':'block';
    }

    /**
     * Does the CSS for the alignment (left, right, center).
     */
    get styleOuter() {
        switch ( this.align ) {
            case 'left': return {'margin-left':0,'margin-right':'auto'};
            case 'right': return {'margin-left':'auto','margin-right':0};
            case 'center': return {'margin-left':'auto','margin-right':'auto'};
            default: return {};
        }
    }

    /**
     * Get the CSS style for the image tag.
     */
    get styleImg() {
        let style: any = { ...this.dimensions };
        // When the frame has a specific height, center the image tag inside the frame vertically:
        if ( this.withFrameHeight ) {
            style.position = 'absolute';
            style.top = style.left = style.bottom = style.right = 0;
            style.margin = 'auto';
        }
        return style;
    }

    /**
     * Get the netto height of the parent element, less the border width and the padding.
     */
    public getWidthOfParent() {
        return Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).width.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingLeft.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingRight.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderLeftWidth.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderRightWidth.replace( /px$/, '' ));
    }

    /**
     * Determine the maximal width of the image. Depending on the width of the parent.
     */
    public determineMaxWidthOfImage() {
        return Math.round( this.getWidthOfParent() );
    }

    /**
     * Get the netto height of the parent element, less the border width and the padding.
     */
    public getHeightOfParent() {
        return Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).height.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingTop.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingBottom.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderTopWidth.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderBottomWidth.replace( /px$/, '' ));
    }

    /**
     * Determine the maximal height of the image, depending on the height of the parent.
     */
    public determineMaxHeightOfImage() {
        return Math.round( this.getHeightOfParent() );
    }

    public openImagePreview() {
        this.modal.openModal('SystemImagePreviewModal').subscribe(modalref => {
            this.mediafiles.getImageBase64( this.media_id ).subscribe( data => {
                modalref.instance.imgtype = data.filetype;
                modalref.instance.imgsrc = 'data:' + data.filetype  + ';base64,' + data.img;
            });
        });
    }

}
