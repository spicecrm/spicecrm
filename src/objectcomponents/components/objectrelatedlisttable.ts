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
import {Component, Input, OnInit} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {backend} from '../../services/backend.service';
import {loggerService} from '../../services/logger.service';

/**
 * A generic component that displays a list for a set of related models. Requires to be embedded in a component that provides a [[relatedmodels]] service.
 */
@Component({
    selector: 'object-relatedlist-table',
    templateUrl: './src/objectcomponents/templates/objectrelatedlisttable.html'
})
export class ObjectRelatedlistTable implements OnInit {

    /**
     * an array with the fields to be displayed in the table
     */
    @Input() public listfields: any[] = [];

    /**
     * set to true if inline editing shoudlbe enabled for the table
     */
    @Input() private editable: boolean = false;

    /**
     * define a separate edit componentset that will be rendered with the edit dialog if the user chooses to edit a record
     *
     * typical usecase is to add fields fromt eh linkl (e.g. in teh buying center) to the fieldset. Those fields are specific to a relationship and can only be added as part of that
     */
    @Input() private editcomponentset: boolean = false;

    /**
     * set one field as the one holding a sequence
     */
    @Input() private sequencefield: string = null;

    /**
     * set to true to hide the actionset menu item being display
     */
    @Input() private hideActions: boolean = false;

    /**
     * the list item actionset
     */
    @Input() private listitemactionset: string;

    /**
     * set if no access to the related odule is allowed
     */
    private noAccess: boolean = false;

    private nowDragging = false;
    private isSequenced = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
        public layout: layout,
        public backend: backend,
        private logger: loggerService) {
    }

    public ngOnInit() {

        // check access
        if (!(this.metadata.checkModuleAcl(this.relatedmodels.relatedModule, 'listrelated') || this.metadata.checkModuleAcl(this.relatedmodels.relatedModule, 'list'))) {
            this.noAccess = true;
            return;
        }

        if (!this.metadata.fieldDefs[this.model.module][this.relatedmodels._linkName]) {
            this.logger.error('Missing link or wrong link name ("' + this.relatedmodels._linkName + '")!');
        } else {
            if (!this.sequencefield && this.metadata.fieldDefs[this.model.module][this.relatedmodels._linkName].sequence_field) {
                this.sequencefield = this.metadata.fieldDefs[this.model.module][this.relatedmodels._linkName].sequence_field;
            }
        }
        if (this.sequencefield) this.isSequenced = true;
    }

    get isloading() {
        return this.relatedmodels.isloading;
    }

    get isSmall() {
        return this.layout.screenwidth === 'small';
    }

    get module() {
        return this.relatedmodels.relatedModule;
    }

    private isSortable(field): boolean {
        if (this.relatedmodels.sortBySequencefield) return false;
        return field.fieldconfig.sortable === true;
    }

    private setSortField(field): void {
        if (this.relatedmodels.sortBySequencefield) return;
        if (this.isSortable(field)) {
            this.relatedmodels.sortfield = field.fieldconfig && field.fieldconfig.sortfield ? field.fieldconfig.sortfield : field.field;
        }
    }

    private getSortIcon(field): string {
        if (this.relatedmodels.sortfield == (field.fieldconfig && field.fieldconfig.sortfield ? field.fieldconfig.sortfield : field.field)) {
            return this.relatedmodels.sort.sortdirection === 'ASC' ? 'arrowdown' : 'arrowup';
        }
        return '';
    }

    private getIdOfRow(index, item) {
        return item.id;
    }

    private drop(event) {
        let previousItem = this.relatedmodels.items.splice(event.previousIndex, 1);
        this.relatedmodels.items.splice(event.currentIndex, 0, previousItem[0]);

        let updateArray = [];
        let i = 0;
        for (let item of this.relatedmodels.items) {
            item[this.sequencefield] = i;
            updateArray.push({id: item.id, sequence_number: i});
            i++;
        }

        this.backend.postRequest('module/' + this.relatedmodels.relatedModule, {}, updateArray);
    }

    private dragStarted(e) {
        this.nowDragging = true;
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    private dragEnded(e) {
        this.nowDragging = false;
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

}
