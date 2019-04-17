/**
 * @module AdminComponentsModule
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {language} from '../../services/language.service';
import {administrationconfigurator} from '../services/administrationconfigurator.service';

@Component({
    selector: 'administration-configurator',
    templateUrl: './src/admincomponents/templates/administrationconfigurator.html',
    providers: [administrationconfigurator]
})
export class AdministrationConfigurator implements OnInit {

    componentconfig: any = {};
    displayFilters: boolean = false;
    filters: any = {};

    constructor(
        private metadata: metadata,
        private administrationconfigurator: administrationconfigurator,
        private language: language
    ) {

    }

    ngOnInit() {
        this.administrationconfigurator.dictionary = this.componentconfig.dictionary;
        this.administrationconfigurator.loadEntries(this.componentconfig.fields);
    }

    get count(){
        return this.administrationconfigurator.entries.length;
    }

    getEntries() {
        let entries = [];
        for (let entry of this.administrationconfigurator.entries) {
            // check for filters
            let ignoreentry = false;
            if(this.displayFilters) {
                for (let filterfield in this.filters) {
                    if (!this.administrationconfigurator.isEditMode(entry.id) && this.filters[filterfield] && entry.data[filterfield] && entry.data[filterfield].indexOf(this.filters[filterfield]) == -1)
                        ignoreentry = true;
                }
            }

            if (!ignoreentry)
                entries.push(entry);
        }
        return entries;
    }

    getFields() {
        let fields = [];

        for (let field of this.componentconfig.fields) {
            if (field.hidden !== true)
                fields.push(field);
        }

        return fields;
    }

    addEntry() {
        this.administrationconfigurator.addEntry();
    }

    sort(field) {
        this.administrationconfigurator.sort(field);
    }

    toggleFilter() {
        this.displayFilters = !this.displayFilters;
    }

    clearFilter(){
        this.filters = {};
    }
}