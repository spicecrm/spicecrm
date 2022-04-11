/**
 * @module GlobalComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {configurationService} from '../../services/configuration.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Subscription} from 'rxjs';

@Component({
    selector: 'global-header-image',
    templateUrl: '../templates/globalheaderimage.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalHeaderImage {

    /**
     * Default image url.
     */
   public defaultImageUrl = 'config/headerimage';

    /**
     * The URL for the image tag:
     * Either a base64 string from the CRM config (if available) or the default image url.
     */
   public imageUrl: SafeResourceUrl | string = this.defaultImageUrl;

    /**
     * Subscription to configuration service.
     */
   public subscription: Subscription;

    constructor(public sanitizer: DomSanitizer, public cdref: ChangeDetectorRef, public configuration: configurationService) {

        // Set the image url in case there is a CRM config for that:
        if (this.configuration.hasCapabilityConfig('theme')) this.setImageUrl();

        // Update the image url in case the configuration data has changed:
        this.subscription = this.configuration.loaded$.subscribe(loaded => {
                if (loaded) this.setImageUrl();
            }
        );

    }

    /**
     * Update the image url  an there is a specific header image defined.
     */
   public setImageUrl(): void {
        // Update the image url in case the configuration data has changed an there is a specific header image defined.
        if(this.configuration.getAsset('headerimage')){
            this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl( this.configuration.getAsset('headerimage') );
        } else if (this.configuration.getCapabilityConfig('theme').header_image) {
            this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:' + this.configuration.getCapabilityConfig('theme').header_image);
        } else {
            this.imageUrl = this.defaultImageUrl;
        }

        // detect changes
        // this.cdref.detectChanges();
    }

    /**
     * Unsubscribe from the configuration service when the component is destroyed.
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
