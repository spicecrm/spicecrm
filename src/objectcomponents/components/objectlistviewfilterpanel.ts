/**
 * @module ObjectComponents
 */
import {
    Component,
    ElementRef, Renderer2
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {listfilters} from '../services/listfilters.service';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'object-listview-filter-panel',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanel.html',
    providers: [listfilters]
})
export class ObjectListViewFilterPanel {

    private filter = {
        logicaloperator: 'and',
        groupscope: 'all',
        conditions: []
    };

    constructor(private elementRef: ElementRef, private listfilters: listfilters, private language: language, private metadata: metadata, private modellist: modellist, private model: model, private renderer: Renderer2) {
        this.setBaseFilter();
        this.modellist.listtype$.subscribe(newlist => this.setBaseFilter());
    }

    get module() {
        return this.modellist.module;
    }

    private setBaseFilter() {
        this.listfilters.basefilter = this.modellist.getBaseFilter();
        this.listfilters.loadedBasefilter = this.modellist.getBaseFilter();

        this.listfilters.filters = this.modellist.getFilterDefs();
        this.listfilters.loadedFilters = this.modellist.getFilterDefs();
    }

    get isChanged() {
        return this.listfilters.isDirty();
    }

    private save() {
        this.modellist.updateListType({
            basefilter: this.listfilters.basefilter,
            filterdefs: btoa(JSON.stringify(this.listfilters.filters))
        }).subscribe(retval => {
            this.listfilters.loadedBasefilter = this.modellist.getBaseFilter();
            this.listfilters.loadedFilters = this.modellist.getFilterDefs();
        });
    }

    private cancel() {
        this.listfilters.basefilter = this.modellist.getBaseFilter();
        this.listfilters.filters = this.modellist.getFilterDefs();
    }

    /**
     * remove all Filters
     */
    private removeAllFilters() {
        this.filter.conditions = [];
    }

    private getPanelStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        };
    }

    private addExpression() {
        let expression = {
            field: '',
            operator: '',
            filtervalue: ''
        };
        this.filter.conditions.push(expression);
    }

    /**
     * delete a filter item
     *
     * @param index index of the filter item
     */
    private deleteItem(index) {
        this.filter.conditions.splice(index, 1);
    }
}
