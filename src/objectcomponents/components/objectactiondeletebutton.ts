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
 * @module ObjectComponents
 */
import {AfterViewInit, Component, Injector, OnDestroy, Optional} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from "rxjs";
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';
import {navigationtab} from '../../services/navigationtab.service';


/**
 * standard actionset item to delete a model
 */
@Component({
    selector: 'object-action-delete-button',
    templateUrl: './src/objectcomponents/templates/objectactiondeletebutton.html',
    providers: [helper]
})
export class ObjectActionDeleteButton implements AfterViewInit, OnDestroy {

    /**
     * defines if the delete ooptionis disabled. By defualt it is but this is checked on model load and model changes and set accordingly to ACL Rules there
     */
    public disabled: boolean = true;

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    /**
     * holds the subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    /**
     * holds the action config
     */
    public actionconfig: any = {};

    constructor(private language: language, private metadata: metadata, private model: model, @Optional() private navigationtab: navigationtab, private router: Router, private helper: helper, private injector: Injector) {

        // handleDisabled on on model.mode changes
        this.subscriptions.add(
            this.model.mode$.subscribe(mode => {
                this.handleDisabled(mode);
            })
        );

        // handleDisabled on on model.data changes
        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
            })
        );
    }

    /*
    * @return boolean
    */
    get canDelete() {
        try {
            return this.model.checkAccess('delete');
        } catch (e) {
            return false;
        }
    }

    /*
    * @handleDisabled
    */
    public ngAfterViewInit() {
        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @confirm delete
    * @delete if answer is true
    */
    public execute() {
        this.helper.confirm(this.language.getLabel('MSG_DELETE_RECORD'), this.language.getLabel('MSG_DELETE_RECORD', 'long'))
            .subscribe(answer => {
                if (answer) {
                    this.delete();
                }
            });
    }

    /*
    * @model.delete
    * @navigate to list view
    */
    private delete() {
        this.model.delete().subscribe(status => {
            this.completeAction();
        });
    }

    /**
     * completes and redirects to the list except other set in the config
     */
    private completeAction() {
        // if no redirect is supposed to happen return true
        if (this.actionconfig.noredirectoncomplete == true) return;

        // reditrect to the list
        // this.router.navigate(['/module/' + this.model.module]);

        // close the tab if we have one
        if (this.navigationtab && this.navigationtab.tabid != 'main') {
            this.navigationtab.closeTab();
        } else {
            this.router.navigate(['/module/' + this.model.module]);
        }
    }

    /*
    * @set disabled
    * @delete if answer is true
    */
    private handleDisabled(mode) {
        if (!this.canDelete) {
            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit';
    }
}
