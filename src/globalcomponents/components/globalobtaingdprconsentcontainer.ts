/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/globalcomponents/templates/globalobtaingdprconsentcontainer.html',
})
export class GlobalObtainGDPRConsentContainer implements AfterViewInit {

    /*
     * The configuration of this component (optional).
     */
    private componentConfig: any;

    /*
     * The name of a custom child component, if defined in the component configuration.
     */
    private nameOfCustomComponent: string;

    /*
     * The template container where a custom child component would get inserted.
     */
    @ViewChild('container', { read: ViewContainerRef, static: false }) private container: ViewContainerRef;

    /*
     * Reference to the inserted child component.
     */
    @ViewChild(GlobalObtainGDPRConsent) private childComponent: GlobalObtainGDPRConsent;

    /*
     * Indicates whether the default GDPR consent has to be shown or not.
     */
    private showDefault = false;

    /*
     * The label for the modal header. Can get overridden with a value defined in the custom child component.
     */
    private headerLabel = 'LBL_GDPR_DATA_AGREEMENT';
    private taglineLabel = 'MSG_TO_CONTINUE_AGREE_TO_GDPR_CONSENT';

    /*
     * The label for the save button. Can get overridden with a value defined in the custom child component.
     */
    private saveButtonLabel = 'LBL_I_AGREE';

    private canSave = () => !!this.childComponent && this.childComponent.canSave();
    private isSaving = () => !!this.childComponent && this.childComponent.isSaving;

    private self: any;

    constructor( private metadata: metadata, private language: language, private login: loginService ) { }

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
    private save(): void {
        this.childComponent.save();
    }

    /*
     * Close the modal (because obtaining the gdpr consent has been finished or cancelled).
     */
    private finished( success: boolean ): void {
        if ( !success ) this.login.logout();
        this.self.destroy();
    }

}
