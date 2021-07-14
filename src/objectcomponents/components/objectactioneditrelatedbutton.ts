/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ObjectComponents
 */
import {Component, Directive, OnDestroy, OnInit, ViewChild, SkipSelf} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-action-edit-related-button',
    templateUrl: './src/objectcomponents/templates/objectactioneditrelatedbutton.html',
    providers: [model]
})
export class ObjectActionEditRelatedButton implements OnInit, OnDestroy {

    public disabled: boolean = true;

    /**
     * the action config from the actionset
     */
    public actionconfig: any = {};

    /**
     * this is a helper so we have a subcomponent that can provide a new model
     *
     * this model is detected via teh component and then addressed
     */
    private subscriptions: Subscription = new Subscription();

    constructor(
        private language: language,
        private metadata: metadata,
        @SkipSelf() private parent: model,
        private model: model
    ) {

    }

    public ngOnInit() {
        this.handleDisabled(this.parent.isEditing ? 'edit' : 'display');

        // handleDisabled on on model.mode changes
        this.subscriptions.add(
            this.parent.mode$.subscribe(mode => {
                this.handleDisabled(mode);
            })
        );

        // handleDisabled on on model.data changes
        this.subscriptions.add(
            this.parent.data$.subscribe(data => {
                // Set the module of the new model and open a modal with copy rules
                this.model.module = this.actionconfig.module;
                this.model.id = this.parent.getFieldValue(this.actionconfig.parent_field);
                // this.model.getData(false);

                this.handleDisabled(this.parent.isEditing ? 'edit' : 'display');
            })
        );
    }

    get hidden() {
        return this.model.id ? false : true;
    }

    public execute() {
        this.model.edit(true);
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @set disabled
    */
    private handleDisabled(mode) {
        if (this.parent.data.acl && !this.parent.checkAccess('edit')) {
            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit';
    }
}
