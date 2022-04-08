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
    templateUrl: '../templates/globalsearchmodule.html'
})
export class GlobalSearchModule implements OnInit {
    @Input()public module: string = '';
    @Output()public scope: EventEmitter<string> = new EventEmitter<string>();
   public listfields: any[] = [];

    constructor(public metadata: metadata,public elementref: ElementRef, router: Router,public fts: fts,public language: language,public layout: layout) {

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
}
