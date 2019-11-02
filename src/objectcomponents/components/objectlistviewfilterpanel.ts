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

declare var _: any;

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
        this.modellist.listtype$.subscribe(newList => {
            this.setFilter();
        });
    }

    get module() {
        return this.modellist.module;
    }

    private setFilter() {
        this.filter = {...this.modellist.getFilterDefs()};
        // if no filter is set ... set it fresh
        if (!this.filter || _.isEmpty(this.filter)) {
            this.filter = {
                logicaloperator: 'and',
                groupscope: 'all',
                conditions: []
            };
        }
    }

    get isChanged() {
        return JSON.stringify(this.filter) != JSON.stringify(this.modellist.getFilterDefs());
    }

    private save() {
        this.modellist.updateListType({
            filterdefs: JSON.stringify(this.filter)
        });
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
