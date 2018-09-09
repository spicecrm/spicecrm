import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {Subject} from 'rxjs';

@Component({
    templateUrl: './src/workbench/templates/dictionarymanager.html',
    providers: [metadata]
})
export class DictionaryManager {

    currentDictionaryTable: string = "";
    dictionaryTables: Array<any> = [];
    dictionaryDomains: Array<any> = [];
    displayFilters: boolean = false;
    filters: any = {};

    displayFields: Array<any> = [
        {name: 'name', type: 'string'},
        {name: 'sysdictdomains_id', type: 'domain'},
        {name: 'vname', type: 'string'},
        {name: 'prefix', type: 'string'},
        {name: 'duplicate_merge', type: 'string'},
        {name: 'status', type: 'string'}
    ];

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private broadcast: broadcast, private toast: toast) {

        this.backend.getRequest('dictionary/tables').subscribe(tables => {
            this.dictionaryTables = tables;
        })

        this.backend.getRequest('dictionary/domains').subscribe(domains => {
            this.dictionaryDomains = domains;
        })
    }

    getFields() {

    }

    toggleFilter() {
        this.displayFilters = !this.displayFilters;
    }

    clearFilter() {
        this.filters = {};
    }

    getEntries() {
        let retFields = [];
        this.dictionaryTables.some(table => {
            if (table.id === this.currentDictionaryTable) {
                // retFields = table.tablesFields;
                for(let retField of table.tablesFields) {
                    let ignoreentry = false;
                    if (this.displayFilters) {
                        for (let filterfield in this.filters) {
                            if (this.filters[filterfield] && retField[filterfield] && retField[filterfield].indexOf(this.filters[filterfield]) == -1)
                                ignoreentry = true;
                        }
                    }

                    if(!ignoreentry)
                        retFields.push(retField)
                }

                return true;
            }
        })
        return retFields;
    }
}