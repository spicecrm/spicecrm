/**
 * @module GlobalComponents
 */
import { Component } from '@angular/core';
import { configurationService } from '../../services/configuration.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'global-header-image',
    templateUrl: './src/globalcomponents/templates/globalheaderimage.html'
})
export class GlobalHeaderImage {

    constructor( private sanitizer: DomSanitizer, private configuration: configurationService ) { }

    /**
     * The URL for the image tag:
     * Either a base64 string from the CRM config (if available) or the conventional link (pointing to .
     */
    private getImageUrl(): SafeResourceUrl | string {
        if ( this.configuration.getCapabilityConfig('spiceTheme').headerImage ) return this.sanitizer.bypassSecurityTrustResourceUrl( 'data:'+this.configuration.getCapabilityConfig('spiceTheme').headerImage );
        else return 'config/headerimage';
    }

}

