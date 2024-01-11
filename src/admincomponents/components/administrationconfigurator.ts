/**
 * @module AdminComponentsModule
 */
import {
    Component, ElementRef,
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
    templateUrl: '../templates/administrationconfigurator.html',
    providers: [administrationconfigurator]
})
export class AdministrationConfigurator implements OnInit {

    /**
     *
     * @private
     */
    public componentconfig: any = {};

    /**
     *
     * set if filters shoudl be displayed
     *
     * @private
     */
    public displayFilters: boolean = false;

    /**
     * filters applied
     *
     * @private
     */
    public filters: any = {};

    constructor(
        public metadata: metadata,
        public administrationconfigurator: administrationconfigurator,
        public language: language,
        public elementRef: ElementRef
    ) {

    }

    public ngOnInit() {
        this.administrationconfigurator.dictionary = this.componentconfig.dictionary;
        this.administrationconfigurator.loadEntries(this.componentconfig.fields);
        if (Array.isArray(this.componentconfig.reloadTaskItems)) {
            this.administrationconfigurator.reloadTaskItems = this.componentconfig.reloadTaskItems;
        }
    }

    /**
     * a getter for the item fields that excludes fields that have a detail only flag set
     */
    get itemFields(){
        return this.getFields().filter(f => f.detailonly !== true);
    }

    get count(){
        return this.administrationconfigurator.entries.length;
    }

    get width(){
        return this.elementRef.nativeElement.width;
    }

    public trackByFn(index, item) {
        return item.id;
    }

    public getEntries() {
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

    public getFields(itemonly = false) {
        let fields = [];

        for (let field of this.componentconfig.fields) {
            if (field.hidden !== true) {
                fields.push(field);
            }
        }

        return itemonly ? fields.filter(f => f.detailonly !== true) :  fields;
    }

    public addEntry() {
        this.administrationconfigurator.addEntry();
    }

    public sort(field) {
        this.administrationconfigurator.sort(field);
    }

    public toggleFilter() {
        this.displayFilters = !this.displayFilters;
    }

    public clearFilter(){
        this.filters = {};
    }
}
