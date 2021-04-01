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
 * @module ModuleReports
 */
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'reporter-filter-item-enum',
    templateUrl: './src/modules/reports/templates/reporterfilteritemenum.html'
})
export class ReporterFilterItemEnum implements OnInit, OnDestroy {

    @Input() private field: string = '';
    @Input() private isMultiSelect: boolean = false;
    @Input() private wherecondition: any = {};

    private fieldName: string;
    private moduleName: string;

    private enumOptions: any[] = [];
    private _value: any = [];
    private subscription: Subscription = new Subscription();

    constructor(private metadata: metadata, private language: language, private backend: backend) {
        this.subscription = this.language.currentlanguage$.subscribe(() => {
            this.getEnumOptions();
        });
    }

    get isDisabled() {
        return this.enumOptions.length == 0;
    }


    get value() {
        return this._value;
    }

    set value(value) {
        if (this.isMultiSelect) {
            this._value = value;
            value = value.join(',');
        }
        this.wherecondition[this.field] = value;
        this.wherecondition[this.field + 'key'] = this.wherecondition[this.field];
    }

    public ngOnInit() {
        let pathArray = this.wherecondition.path.split('::');

        // get the entries in the path
        let arrCount = pathArray.length;

        // the last entry has to be the field
        let fieldArray = pathArray[arrCount - 1].split(':');
        this.fieldName = fieldArray[1];

        let moduleArray = pathArray[arrCount - 2].split(':');
        switch (moduleArray[0]) {
            case 'root':
                this.moduleName = moduleArray[1];
                break;
            case 'link':
                let field = this.metadata.getFieldDefs(moduleArray[1], moduleArray[2]);
                this.moduleName = field.module;
                break;
        }

        // get the enum options
        this.getEnumOptions();
        this.initializeValueArray();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private initializeValueArray() {
        const value = this.wherecondition[this.field + 'key'] ? this.wherecondition[this.field + 'key'] : this.wherecondition[this.field];
        this._value = this.isMultiSelect ? (!!value ? value.split(',') : []) : value;
    }

    private getEnumOptions() {
        // if we have module and fieldname we can get the otpions locally .. otherwise we try remote
        if (this.moduleName && this.fieldName) {
            this.enumOptions = this.language.getFieldDisplayOptions(this.moduleName, this.fieldName, true);
        } else {
            this.backend.getRequest('KReporter/core/enumoptions', {path: this.wherecondition.path}).subscribe(options => {
                if (!options || options.length == 0) return;
                this.enumOptions = options.map(option => ({value: option.value, display: option.text}));
            });
        }
    }

    /**
     * initialize value on changes
     */
    public ngOnChanges() {
        this.initializeValueArray();
    }
}
