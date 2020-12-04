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
