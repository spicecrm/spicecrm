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
                    total: item.data.total,
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
