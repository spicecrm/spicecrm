/**
 * @module GlobalComponents
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { configurationService } from '../../services/configuration.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
    selector: 'global-login-image',
    templateUrl: './src/globalcomponents/templates/globalloginimage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalLoginImage {

    /**
     * The default image url.
     */
    private defaultImageUrl = 'config/loginimage';

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
        if ( this.configuration.hasCapabilityConfig('spice_theme') ) this.setImageUrl();

        // Update the image url in case the configuration data has changed:
        this.subscription = this.configuration.loaded$.subscribe( () => this.setImageUrl() );

    }

    private setImageUrl(): void {
        // Update the image url in case the configuration data has changed an there is a specific login image defined.
        if ( this.configuration.getCapabilityConfig('spice_theme').login_image ) {
            this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl( 'data:'+this.configuration.getCapabilityConfig('spice_theme').login_image );
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

