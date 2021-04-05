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
 * @module ModuleActivities
 */
import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {Subscription} from "rxjs";

/**
 * This component shows the closebutton of an activity
 */
@Component({
    selector: 'action-activity-close-button',
    templateUrl: './src/modules/activities/templates/actionactivityclosebutton.html'
})
export class ActionActivityCloseButton implements OnInit, OnDestroy {

    /**
     * only "disabled" is in use !
     */
    public hidden: boolean = false;

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    /**
     * if the button shoudl be disabled
     */
    public disabled: boolean = true;

    /**
     * the component config
     */
    public componentconfig: any;

    /**
     * holds the components subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private viewContainerRef: ViewContainerRef
    ) {

    }

    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig('ActionActivityCloseButton', this.model.module);

        if(this.model.data[this.componentconfig.statusField] == this.componentconfig.statusValues) {
            this.handleDisabled('display');
        }

        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');

        this.subscriptions.add(
            this.model.mode$.subscribe(mode => {
                this.handleDisabled(mode);
            })
        );

        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
            })
        );
    }

    /**
     * unsubscribe from various subscrioptions on destroy
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * Click: It opens a modal with the action- and componentset in the "module configuration"
     */
    public execute() {
        let componentSet = this.componentconfig.componentset;
        let actionSet = this.componentconfig.actionset;
        this.modal.openModal('ActivityCloseModal', true, this.viewContainerRef.injector).subscribe(editModalRef => {
            if (editModalRef) {
                if (componentSet && componentSet != "") {
                    editModalRef.instance.componentSet = componentSet;
                }
                if (actionSet && actionSet != "") {
                    editModalRef.instance.actionSet = actionSet;
                }
                this.model.startEdit();
            }
        });
    }

    /**
     * handles the setting of the disbaled attribute
     *
     * @param mode
     */
    private handleDisabled(mode) {
        if (this.model.data.acl && !this.model.checkAccess('edit')) {

            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit' ? true : false;
    }
}
