/**
 * @module GlobalComponents
 */
import {ElementRef, Component, Input, ViewChild, ViewContainerRef, OnInit, OnChanges} from '@angular/core';
import {Router} from '@angular/router';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'global-search-module-only',
    templateUrl: '../templates/globalsearchmoduleonly.html'
})
export class GlobalSearchModuleOnly implements OnChanges {
    @ViewChild('tablecontent', {read: ViewContainerRef, static: true})public tablecontent: ViewContainerRef;
    @Input()public module: string = '';
   public listfields: any[] = [];

    constructor(public broadcast: broadcast,public metadata: metadata,public elementref: ElementRef, router: Router,public fts: fts,public language: language,public layout: layout) {

    }

    get issmall() {
        return this.layout.screenwidth == 'small';
    }

    public ngOnChanges() {
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
                    total: item.data.total,
                    hits: item.data.hits.length
                };
                return true;
            }
        });
        return resultCount;
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


   public onScroll(e): void {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.fts.loadMore();
        }
    }
}
