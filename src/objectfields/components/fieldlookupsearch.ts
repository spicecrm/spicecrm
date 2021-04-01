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
 * @module ObjectFields
 */
import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {model} from '../../services/model.service';
import {modellist, relateFilter} from '../../services/modellist.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {Subscription} from "rxjs";

/**
 * renders the lookup search dropdown
 */
@Component({
    selector: 'field-lookup-search',
    templateUrl: './src/objectfields/templates/fieldlookupsearch.html',
    providers: [modellist]
})
export class fieldLookupSearch implements OnInit, OnChanges {
    /**
     * the searchterm entered
     */
    private searchTerm: string = '';

    /**
     * a timeout to have a delay when typing until the search starts
     */
    private searchTimeout: any = {};

    /**
     * the module we are searching for
     */
    @Input() private module: string = '';

    /**
     * an optional mddulefilter to be appilied to the searches
     */
    @Input() private modulefilter: string = '';

    /**
     * set to disable the add functionality by the config
     */
    @Input() private disableadd: boolean = false;

    /**
     * a relate filter for the modellist
     */
    @Input() private relatefilter: relateFilter;

    /**
     * additonal input for the id of the relate filter so the onChange can detect and trigger a reload
     */
    @Input() private relateId: string;

    /**
     * an emitter if an object has been selected
     */
    @Output() private selectedObject: EventEmitter<any> = new EventEmitter<any>();

    /**
     * emit to open the modal for the search
     */
    @Output() private searchWithModal = new EventEmitter();

    /**
     * emits when the searchterm has been changed
     */
    @Output() private searchtermChange = new EventEmitter<string>();

    /**
     * holds the various subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    @Input() set searchterm(value) {
        this.searchTerm = value;
        if (this.searchTimeout) {
            window.clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = window.setTimeout(() => this.doSearch(), 500);
    }

    constructor(private metadata: metadata, public model: model, public modellist: modellist, public language: language, private modal: modal) {
    }

    /**
     * initialize the modellist service
     */
    public ngOnInit() {
        // set th efilters
        this.modellist.modulefilter = this.modulefilter;
        if (this.relatefilter) {
            this.modellist.relatefilter = this.relatefilter;
        }

        this.modellist.loadlimit = 5;

        // set the module
        this.modellist.setModule(this.module, true);
    }

    /**
     * react to changes of the relatedId
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.relateId) {
            this.modellist.getListData();
        }
    }

    /**
     * simple getter to check if add is enabled and the user has create rights on the module
     */
    get canAdd() {
        return !this.disableadd && this.metadata.checkModuleAcl(this.module, 'edit');
    }

    /**
     * run the search
     */
    private doSearch() {
        if (this.searchTerm !== '' && this.searchTerm !== this.modellist.searchTerm) {
            this.modellist.searchTerm = this.searchTerm;
            this.modellist.getListData();
        }
    }

    /**
     * sets the item
     *
     * @param data the data of the selected model
     */
    private setItem(data: any) {
        // reset and emit the empty searchterm
        this.searchTerm = '';
        this.searchtermChange.emit(this.searchTerm);

        // emit the selected Object
        this.selectedObject.emit({id: data.id, text: data.summary_text, data});
    }

    /**
     * when a record has been added
     *
     * @param record the created record
     */
    private recordAdded(record) {
        this.setItem(record.data);
    }

}
