/**
 * @module GlobalComponents
 */
import {ChangeDetectionStrategy, Component, ChangeDetectorRef, OnDestroy, AfterViewInit} from '@angular/core';
import { configurationService } from '../../services/configuration.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
    selector: 'global-login-image',
    templateUrl: '../templates/globalloginimage.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalLoginImage implements OnDestroy, AfterViewInit {

    /**
     * The default image url.
     */
   public defaultImageUrl = 'config/loginimage';

    /**
     * The URL for the image tag:
     * Either a base64 string from the CRM config (if available) or the default image url.
     */
   public imageUrl: SafeResourceUrl | string = this.defaultImageUrl;

    /**
     * Subscription to configuration service.
     */
   public subscriptions: Subscription = new Subscription();

    constructor(public sanitizer: DomSanitizer,public configuration: configurationService,public cdRef: ChangeDetectorRef ) {
    }

    public ngAfterViewInit(): void {
        // Set the image url in case there is a CRM config for that:
        if ( this.configuration.hasCapabilityConfig('theme') ) this.setImageUrl();

        // Update the image url in case the configuration data has changed:
        this.subscriptions.add(this.configuration.loaded$.subscribe( loaded => { if( loaded) this.setImageUrl();}));
    }

    /**
     * Unsubscribe from the configuration service when the component is destroyed.
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

   public setImageUrl(): void {
        // Update the image url in case the configuration data has changed an there is a specific login image defined.
        if(this.configuration.getAsset('loginimage')){
            this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl( this.configuration.getAsset('loginimage') );
        } else if ( this.configuration.getCapabilityConfig('theme').login_image ) {
            this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl( 'data:'+this.configuration.getCapabilityConfig('theme').login_image );
        } else {
            this.imageUrl = this.defaultImageUrl;
        }
        this.cdRef.detectChanges();
    }

}

