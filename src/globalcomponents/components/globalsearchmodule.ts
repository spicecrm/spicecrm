/**
 * @module GlobalComponents
 */
import {ElementRef, Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {layout} from '../../services/layout.service';
import {view} from "../../services/view.service";

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'global-search-module',
    templateUrl: '../templates/globalsearchmodule.html',
    providers: [view]
})
export class GlobalSearchModule implements OnInit {
    @Input()public module: string = '';
    @Output()public scope: EventEmitter<string> = new EventEmitter<string>();
    public listfields: any[] = [];

    constructor(
        public metadata: metadata,
        public elementref: ElementRef,
        public fts: fts,
        public language: language,
        public layout: layout,
        public view: view
    ) {}

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
            if (!listField.fieldconfig.hidden) this.listfields.push(listField);
        }
    }

    public getCount(): any {
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

    public canViewMore(): boolean {
        return this.getCount().total > 5;
    }

    public getItems(): any[] {
        let items: any[] = [];
        this.fts.moduleSearchresults.some(item => {
            if (item.module === this.module) {
                items = item.data.hits;
                return true;
            }
        });
        return items;
    }

    public setSearchScope(): void {
        this.scope.emit(this.module);
    }

    /**
     * a helper for the fieldset item to determine the size class in the grid
     * @param i the index of the item
     */
    public sizeClass(i): string {
        // in case of small view size 1-of-1
        if (this.view.size == 'small') return 'slds-size--1-of-1';

        let confWidth = this.listfields[i].fieldconfig.width;

        // if width is not defined in config set default to 1
        if(!confWidth) confWidth = '1';

        // regular -- calculate grid
        return 'slds-col slds-size--' + confWidth + '-of-12';
    }
}
