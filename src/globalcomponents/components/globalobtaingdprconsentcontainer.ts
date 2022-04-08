/**
 * @module GlobalComponents
 */
import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { language } from '../../services/language.service';
import { GlobalObtainGDPRConsent } from './globalobtaingdprconsent';
import { loginService } from '../../services/login.service';

@Component({
    selector: 'global-obtain-gdpr-consent-container',
    templateUrl: '../templates/globalobtaingdprconsentcontainer.html',
})
export class GlobalObtainGDPRConsentContainer implements AfterViewInit {

    /*
     * The configuration of this component (optional).
     */
   public componentConfig: any;

    /*
     * The name of a custom child component, if defined in the component configuration.
     */
   public nameOfCustomComponent: string;

    /*
     * The template container where a custom child component would get inserted.
     */
    @ViewChild('container', { read: ViewContainerRef, static: false })public container: ViewContainerRef;

    /*
     * Reference to the inserted child component.
     */
    @ViewChild(GlobalObtainGDPRConsent)public childComponent: GlobalObtainGDPRConsent;

    /*
     * Indicates whether the default GDPR consent has to be shown or not.
     */
   public showDefault = false;

    /*
     * The label for the modal header. Can get overridden with a value defined in the custom child component.
     */
   public headerLabel = 'LBL_GDPR_DATA_AGREEMENT';
   public taglineLabel = 'MSG_TO_CONTINUE_AGREE_TO_GDPR_CONSENT';

    /*
     * The label for the save button. Can get overridden with a value defined in the custom child component.
     */
   public saveButtonLabel = 'LBL_I_AGREE';

   public canSave = () => !!this.childComponent && this.childComponent.canSave();
   public isSaving = () => !!this.childComponent && this.childComponent.isSaving;

   public self: any;

    constructor(public metadata: metadata,public language: language,public login: loginService ) { }

    public ngAfterViewInit() {
        this.displayComponent();
    }

    /*
     * .....
     */
    public displayComponent(): void {
        this.componentConfig = this.metadata.getComponentConfig( 'GlobalObtainGDPRConsentContainer' );
        if ( this.componentConfig && this.componentConfig.customComponent ) {
            this.nameOfCustomComponent = this.componentConfig.customComponent;
            this.metadata.addComponent( this.nameOfCustomComponent, this.container ).subscribe( ( comp ) => {
                if ( comp.instance.headerLabel ) this.headerLabel = comp.instance.headerLabel; // For the header: Get the specific label, if defined.
                if ( comp.instance.taglineLabel ) this.taglineLabel = comp.instance.taglineLabel; // For the tagline: Get the specific label, if defined.
                if ( comp.instance.saveButtonLabel ) this.saveButtonLabel = comp.instance.saveButtonLabel; // For the save button: Get the specific label, if defined.
                comp.instance.finished.subscribe( success => this.finished(success) );
                this.childComponent = comp.instance; // Get the reference to the component to access its properties and methods.
            });
        } else {
            this.showDefault = true;
        }
    }

    /*
     * The handler for the save button (for saving the GDPR consent to the backend).
     */
   public save(): void {
        this.childComponent.save();
    }

    /*
     * Close the modal (because obtaining the gdpr consent has been finished or cancelled).
     */
   public finished( success: boolean ): void {
        if ( !success ) this.login.logout();
        this.self.destroy();
    }

}
