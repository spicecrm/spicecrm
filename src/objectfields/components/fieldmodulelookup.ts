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
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer2, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';

@Component({
    selector: 'field-module-lookup',
    templateUrl: './src/objectfields/templates/fieldmodulelookup.html',
    providers: [popup],
})
export class FieldModuleLookupComponent extends fieldGeneric implements OnInit {
    private relateIdField: string = '';
    private relateNameField: string = '';
    @Input() private module: string = '';

    private _selected_item: any = null;

    private clickListener: any;

    private show_search_results: boolean = false;
    private search_term: string = '';

    @Output() public select = new EventEmitter();

    constructor(
        public model: model,
        public view: view,
        public popup: popup,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private elementRef: ElementRef,
        private renderer: Renderer2,
    ) {
        super(model, view, language, metadata, router);
        this.popup.closePopup$.subscribe(() => this.closePopups());
    }

    public ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        if( !this.module ) {
            this.module = fieldDefs.module;
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    private closePopups() {
        this.clickListener();

        if (this.model.data[this.relateIdField]) {
            this.search_term = '';
        }

        this.show_search_results = false;

    }

    private onFocus() {
        this.show_search_results = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    set selected_item(item)
    {
        if( item ) {
            this._selected_item = item.data;
            if (this.relateNameField) {
                this.model.setField(this.relateNameField, item.text);
            }
            if (this.relateIdField) {
                this.model.setField(this.relateIdField, item.id);
            }
        } else {
            this._selected_item = null;
            if(this.relateIdField) {
                this.model.setField(this.relateIdField, '');
            }
            if(this.relateNameField) {
                this.model.setField(this.relateNameField, '');
            }
        }

        this.select.emit(this.selected_item);
    }

    get selected_item()
    {
        return this._selected_item;
    }

    get id(): string {
        if (this.selected_item && this.selected_item.id) {
            return this.selected_item.id;
        } else if (this.relateIdField) {
            return this.model.data[this.relateIdField];
        } else {
            return '';
        }
    }

    get item_summary_text(): string {
        if (this.selected_item && this.selected_item.summary_text) {
            return this.selected_item.summary_text;
        } else if (this.relateNameField) {
            return this.model.data[this.relateNameField];
        } else {
            return '';
        }
    }

    private goToDetail() {
        // go to the record
        this.router.navigate(['/module/' + this.module + '/' + this.selected_item.id]);
    }

    private getSearchStyle() {
        if (this.show_search_results) {
            let rect = this.elementRef.nativeElement.getBoundingClientRect();
            return {
                width: rect.width + 'px',
                display: 'block'
            };
        }
    }

    private clear() {
        this.search_term = '';
        this.selected_item = null;
    }
}
