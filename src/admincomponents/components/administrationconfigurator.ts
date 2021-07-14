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
 * @module AdminComponentsModule
 */
import {
    Component,
    OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {administrationconfigurator} from '../services/administrationconfigurator.service';

/**
 * a generic configurator component that can load entries from a tabel and allow management of those
 */
@Component({
    selector: 'administration-configurator',
    templateUrl: './src/admincomponents/templates/administrationconfigurator.html',
    providers: [administrationconfigurator]
})
export class AdministrationConfigurator implements OnInit {

    /**
     *
     * @private
     */
    private componentconfig: any = {};

    /**
     *
     * set if filters shoudl be displayed
     *
     * @private
     */
    private displayFilters: boolean = false;

    /**
     * filters applied
     *
     * @private
     */
    private filters: any = {};

    constructor(
        private metadata: metadata,
        private administrationconfigurator: administrationconfigurator,
        private language: language
    ) {

    }

    public ngOnInit() {
        this.administrationconfigurator.dictionary = this.componentconfig.dictionary;
        this.administrationconfigurator.loadEntries(this.componentconfig.fields);
    }

    get count(){
        return this.administrationconfigurator.entries.length;
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private getEntries() {
        let entries = [];
        for (let entry of this.administrationconfigurator.entries) {
            // check for filters
            let ignoreentry = false;
            if(this.displayFilters) {
                for (let filterfield in this.filters) {
                    if (!this.administrationconfigurator.isEditMode(entry.id) && this.filters[filterfield] && entry.data[filterfield] && entry.data[filterfield].toUpperCase().indexOf(this.filters[filterfield].toUpperCase()) == -1) ignoreentry = true;
                }
            }

            if (!ignoreentry) {
                entries.push(entry);
            }
        }
        return entries;
    }

    private getFields() {
        let fields = [];

        for (let field of this.componentconfig.fields) {
            if (field.hidden !== true) {
                fields.push(field);
            }
        }

        return fields;
    }

    private addEntry() {
        this.administrationconfigurator.addEntry();
    }

    private sort(field) {
        this.administrationconfigurator.sort(field);
    }

    private toggleFilter() {
        this.displayFilters = !this.displayFilters;
    }

    private clearFilter(){
        this.filters = {};
    }
}
