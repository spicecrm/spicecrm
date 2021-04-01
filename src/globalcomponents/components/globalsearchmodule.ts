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
 * @module GlobalComponents
 */
import {ElementRef, Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {layout} from '../../services/layout.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'global-search-module',
    templateUrl: './src/globalcomponents/templates/globalsearchmodule.html'
})
export class GlobalSearchModule implements OnInit {
    @Input() private module: string = '';
    @Output() private scope: EventEmitter<string> = new EventEmitter<string>();
    private listfields: any[] = [];

    constructor(private metadata: metadata, private elementref: ElementRef, router: Router, private fts: fts, private language: language, private layout: layout) {

    }

    get issmall() {
        return this.layout.screenwidth == 'small';
    }

    public ngOnInit() {
        this.listfields = [];

        // load all fields
        let componentconfig = this.metadata.getComponentConfig('GlobalSearchModule', this.module);
        // if nothing is defined, try to take the default list config...
        if (_.isEmpty(componentconfig)) componentconfig = this.metadata.getModuleDefaultComponentConfigByUsage(this.module, 'list');

        for (let listField of this.metadata.getFieldSetFields(componentconfig.fieldset)) {
            if (listField.fieldconfig.default !== false) this.listfields.push(listField);
        }
    }

    private getCount(): any {
        let resultCount = {};
        this.fts.moduleSearchresults.some(item => {
            if (item.module === this.module) {
                resultCount = {
                    total: _.isNumber(item.data.total) ? item.data.total : item.data.total.value,
                    hits: item.data.hits.length
                };
                return true;
            }
        });
        return resultCount;
    }

    get hidepanel() {
        return !this.fts.runningmodulesearch && this.getCount().total > 0 ? false : true;
    }

    private canViewMore(): boolean {
        return this.getCount().total > 5;
    }

    private getItems(): any[] {
        let items: any[] = [];
        this.fts.moduleSearchresults.some(item => {
            if (item.module === this.module) {
                items = item.data.hits;
                return true;
            }
        });
        return items;
    }

    private setSearchScope(): void {
        this.scope.emit(this.module);
    }
}
