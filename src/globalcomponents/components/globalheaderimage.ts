/**
 * @module GlobalComponents
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { configurationService } from '../../services/configuration.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
    selector: 'global-header-image',
    templateUrl: './src/globalcomponents/templates/globalheaderimage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalHeaderImage {

    /**
     * Default image url.
     */
    private defaultImageUrl = 'config/headerimage';

    /**
     * The URL for the image tag:
     * Either a base64 string from the CRM config (if available) or the default image url.
     */
    private imageUrl: SafeResourceUrl | string = this.defaultImageUrl;

    /**
     * Subscription to configuration service.
     */
    private subscription: Subscription;

    constructor( private sanitizer: DomSanitizer, private configuration: configurationService ) {

        // Set the image url in case there is a CRM config for that:
        if ( this.configuration.hasCapabilityConfig('theme') ) this.setImageUrl();

        // Update the image url in case the configuration data has changed:
        this.subscription = this.configuration.loaded$.subscribe( () => this.setImageUrl() );

    }

    /**
     * Update the image url  an there is a specific header image defined.
     */
    private setImageUrl(): void {
        // Update the image url in case the configuration data has changed an there is a specific header image defined.
        if( this.configuration.getCapabilityConfig( 'theme' ).header_image ) {
            this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl( 'data:' + this.configuration.getCapabilityConfig( 'theme' ).header_image );
        } else {
            this.imageUrl = this.defaultImageUrl;
        }
    }

    /**
     * Unsubscribe from the configuration service when the component is destroyed.
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
