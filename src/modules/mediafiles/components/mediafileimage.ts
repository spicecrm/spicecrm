/**
 * @module ModuleMediaFiles
 */
import { Component, OnChanges, Input, ElementRef } from '@angular/core';
import {mediafiles} from '../../../services/mediafiles.service';

@Component({
    selector: 'media-file-image',
    templateUrl: './src/modules/mediafiles/templates/mediafileimage.html',
    providers: [ mediafiles ],
    styles: [
        'img.withFrameHeight { position:absolute; top:0; left:0; bottom:0; right:0; margin:auto; }'
    ]
})
export class MediaFileImage implements OnChanges {

    @Input() public media_id: string;
    @Input() public variant: string;
    @Input() public classImage: string = '';
    @Input() public classOuter: string = '';
    @Input() public styleImage: string = '';
    @Input() public align: string = '';
    @Input() public size: number = null;
    @Input() public width: number = null;
    @Input() public height: number = null;
    @Input() public frameWidth: number = null;
    @Input() public frameHeight: number = null;
    @Input() public frameSize: number = null;
    @Input() public displayInline: boolean = false;
    @Input() public title: string = '';
    @Input() public alttext: string = '';

    private imageUrl: any;

    private dimensions: any = {};

    private isFirstChange: boolean = true;
    private variantStatic: string;
    private lastMediaId: string = '';

    private withFrameHeight = true;

    constructor( private mediafiles: mediafiles, private elRef: ElementRef ) {}

    public ngOnChanges() {

        console.log('Media ID',this.media_id);

        if ( this.isFirstChange ) {
            this.isFirstChange = false;
            this.variantStatic = this.variant;
        }

        if( this.variantStatic === 'mw' || this.variantStatic === 'mwh' ) {

            if ( this.width != null ) this.dimensions.width = this.width;
            if ( this.height != null ) this.dimensions.height = this.height;

            if ( this.frameWidth === null ) this.frameWidth = this.determineWidthOfImage();
            if ( this.variantStatic === 'mwh' && this.frameHeight === null ) this.frameHeight = this.determineHeightOfImage();
            if ( this.variantStatic === 'mw' ) this.withFrameHeight = false;

        } else { // this.variant === 'th'

            if ( this.size != null ) this.dimensions.height = this.dimensions.width = this.size;
            if ( this.frameSize === null ) this.frameSize = this.determineWidthOfImage();

        }

        if ( this.lastMediaId !== this.media_id ) {
            if( this.media_id ) {
                let sizes4variant;
                switch( this.variantStatic ) {
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
            } else this.imageUrl = '';

        }

    }

    get styleDisplay() {
        return this.displayInline ? 'inline-block':'block';
    }

    get styleOuter() {
        switch ( this.align ) {
            case 'left': return {'margin-left':0,'margin-right':'auto'};
            case 'right': return {'margin-left':'auto','margin-right':0};
            case 'center': return {'margin-left':'auto','margin-right':'auto'};
            default: return {};
        }
    }

    private getWidthOfParent() {
        return Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).width.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingLeft.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingRight.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderLeftWidth.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderRightWidth.replace( /px$/, '' ));
    }
    private determineWidthOfImage() {
        return Math.round( this.getWidthOfParent() );
    }

    private getHeightOfParent() {
        return Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).height.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingTop.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).paddingBottom.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderTopWidth.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement, null ).borderBottomWidth.replace( /px$/, '' ));
    }
    private determineHeightOfImage() {
        return Math.round( this.getHeightOfParent() );
    }

}
