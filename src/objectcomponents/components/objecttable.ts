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
import {
    Attribute,
    Component, EventEmitter,
    Input, OnInit, Output,
} from '@angular/core';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

/**
 * @ignore
 */
declare var _;

/**
 * a generic object table component, used to display an array of objects, providing features like selecting, editing (coming), sorting (coming), pagination (coming)
 * todo: adding editing, sorting, pagination features!
 * created by: sebastian franz at 2018-07-16
 * update: changed selectable and multiselect to attributes
 */
@Component({
    selector: 'object-table',
    templateUrl: './src/objectcomponents/templates/objecttable.html'
})
export class ObjectTable implements OnInit {
    @Input() public fields = [];
    @Input() public objects = [];
    @Input() public selected_objects: any = [];

    @Input("fieldset_id") private fieldset_id: string;
    @Input("module") private module: string;

    @Output('selected_objectsChange') public selected_objects$ = new EventEmitter();
    @Input('max-selections') public max_selections = 0;
    @Output('select') public select$ = new EventEmitter();
    private selectable = false;
    private multiselect = false;

    constructor(
        private language: language,
        private metadata: metadata,
        // @Attribute("fieldset_id") private fieldset_id: string,
        // @Attribute("module") private module: string,
        @Attribute("selectable") selectable: string,
        @Attribute("multiselect") multiselect: string,
    ) {
        // only null is false... everything else is true!
        this.selectable = selectable !== null;
        this.multiselect = multiselect !== null;
    }

    public ngOnInit() {
        if (!this.fields || this.fields.length == 0) {
            if (this.fieldset_id) {
                this.fields = this.metadata.getFieldSetFields(this.fieldset_id);
            } else {
                // try to find the default listview...
                let cmpconf = this.metadata.getComponentConfig('ObjectList', this.module);
                this.fields = this.metadata.getFieldSetFields(cmpconf.fieldset);
            }
        }
        if (!this.fields || this.fields.length == 0) {
            throw new Error(`No fields given, nor found for module ${this.module}`);
        }

        if (this.selectable && this.max_selections < 1) {
            this.max_selections = 1;
        }

        if (this.multiselect && this.max_selections < 2) {
            this.max_selections = 99;   // duh... infinite? maybe -99 ...
        }
    }

    public toggleAll() {
        if (this.selected_objects.length < this.objects.length) {
            this.selected_objects = [...this.objects];
        } else {
            this.selected_objects = [];
        }

        this.selected_objects$.emit(this.selected_objects);
        this.select$.emit(this.selected_objects);
    }

    public select(object) {
        if (!this.findSelectedObject(object) && this.selected_objects.length < this.max_selections) {
            this.selected_objects.push(object);
            this.selected_objects$.emit(this.selected_objects);
            this.select$.emit(this.selected_objects);
        }
    }

    public unselect(object) {
        let idx = this.selected_objects.findIndex(e => e.id == object.id);
        if (idx > -1) {
            this.selected_objects.splice(idx, 1);
            this.selected_objects$.emit(this.selected_objects);
            this.select$.emit(this.selected_objects);
        }
    }

    private isObjectSelected(object) {
        if (this.findSelectedObject(object)) {
            return true;
        } else {
            return false;
        }
    }

    private areAllObjectsSelected() {
        return this.selected_objects.length == this.objects.length;
    }

    private findSelectedObject(object) {
        return this.selected_objects.find(e => e.id == object.id);
    }

}