/**
 * @module GlobalComponents
 */
import { Component } from '@angular/core';
import { configurationService } from '../../services/configuration.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'global-login-image',
    templateUrl: './src/globalcomponents/templates/globalloginimage.html'
})
export class GlobalLoginImage {

    constructor( private sanitizer: DomSanitizer, private configuration: configurationService ) { }

    /**
     * The URL for the image tag:
     * Either a base64 string from the CRM config (if available) or a conventional link.
     */
    private getImageUrl(): SafeResourceUrl | string {
        console.log('getCapConfig',this.configuration.getCapabilityConfig('spiceTheme'));
        if ( this.configuration.getCapabilityConfig('spiceTheme').loginImage ) return this.sanitizer.bypassSecurityTrustResourceUrl( 'data:'+this.configuration.getCapabilityConfig('spiceTheme').loginImage );
        else return 'config/loginimage';
    }

}

