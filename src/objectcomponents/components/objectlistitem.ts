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
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';

/**
 * renders a TR item for the modellist
 */
@Component({
    selector: '[object-list-item]',
    templateUrl: './src/objectcomponents/templates/objectlistitem.html',
    providers: [model, view],
    styles: [
        ':host /deep/ field-container global-button-icon {display:none;}',
        ':host:hover /deep/ field-container global-button-icon {display:inline;}',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectListItem implements OnInit, OnDestroy {

    /**
     * set to treu if the rowselect checkboy should be displayed
     */
    @Input() private rowselect: boolean = false;

    /**
     * if the select ois to be displayed but disabled
     */
    @Input() private rowselectdisabled: boolean = false;


    /**
     * the item
     */
    @Input() private listItem: any = {};

    /**
     * set to true to enable inline editing
     * set from the list from the config
     */
    @Input() private inlineedit: boolean = false;

    /**
     * by default links are dislayed. But in some views the links hsoudl be disabled
     */
    @Input() private displaylinks: boolean = true;

    /**
     * if set to true an action item is rendered
     */
    @Input() private showActionMenu: boolean = true;

    /**
     * an array of subscriptions
     */
    private subscriptions: any[] = [];


    constructor(private model: model, private modelutilities: modelutilities, private modellist: modellist, private view: view, private router: Router, private language: language, private cdref: ChangeDetectorRef) {
        this.view.displayLabels = false;
    }

    /**
     * getter for the listfields
     */
    get listFields() {
        return this.modellist.listfields;
    }

    /**
     * initialize and subscribe to the model changes
     */
    public ngOnInit() {
        this.model.module = this.modellist.module;
        this.model.id = this.listItem.id;
        this.model.data = this.modelutilities.backendModel2spice(this.modellist.module, this.listItem);
        this.model.initializeFieldsStati();

        this.view.isEditable = this.inlineedit && this.model.checkAccess('edit');
        this.view.displayLinks = this.displaylinks;

        // register that the check is run
        this.subscriptions.push(this.model.data$.subscribe(data => this.cdref.detectChanges()));

        // register to listfield changes
        this.subscriptions.push(this.modellist.listfield$.subscribe(data => this.cdref.detectChanges()));

        // trigger change detection on list service
        this.subscriptions.push(this.modellist.selectionChanged$.subscribe(data => this.cdref.detectChanges()));
    }

    /**
     * unsubscribe from any subscription we have
     */
    public ngOnDestroy(): void {
        for(let subscription of this.subscriptions){
            subscription.unsubscribe();
        }
    }

    private navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }
}
