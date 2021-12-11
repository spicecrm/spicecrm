/**
 * @module ObjectComponents
 */
import {Component, Input, ElementRef, QueryList, ViewChildren, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {SystemResizeDirective} from "../../directives/directives/systemresize";
import {layout} from "../../services/layout.service";
import {Subscription} from "rxjs";

/**
 * renders the header row for a list view table
 */
@Component({
    selector: '[object-list-header]',
    templateUrl: '../templates/objectlistheader.html',
    providers: [view]
})
export class ObjectListHeader implements OnDestroy{

    @ViewChildren(SystemResizeDirective) public resizeElements: QueryList<SystemResizeDirective>;

    /**
     * a relaod timeout .. set when the sort is changed to reacxt to subsequent changes and not relaod immediately
     */
    public reloadTimeOut: number;

    /**
     * an action set ot be applied to the list actions
     */
    @Input() public actionset: string = '';

    /**
     * show the select column as first column
     */
    @Input() public showSelectColumn: boolean = true;

    /**
     * show the number column as first column
     */
    @Input() public showRowNumber: boolean = false;

    /**
     * show the number column as first column
     */
    @Input() public showDragHandle: boolean = false;

    /**
     * display the row action menu or hide the column
     */
    @Input() public showRowActionMenu: boolean = true;

    /**
     * keep all suibscriptions
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public modellist: modellist, public language: language, public view: view, public elementRef: ElementRef, public layout: layout, public cdref: ChangeDetectorRef) {
        this.view.labels = 'short';

        // register to listfield changes
        this.subscriptions.add(this.modellist.listfield$.subscribe(data => this.cdref.detectChanges()));
    }

    /**
     * unsubscribe all subscritopions on Destroy
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns if the layout is set to small
     */
    get isSmall() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * returns the listfields
     */
    get listfields() {
        return this.modellist.listfields;
    }

    /**
     * a getter to return the module from the modellist service
     */
    get module() {
        return this.modellist.module;
    }

    /**
     * return the column width if set
     * @param columnId
     */
    public columnWidth(columnId?) {
        let listfield = this.listfields.find(lf => lf.id == columnId);
        return listfield.width ? listfield.width + '%' : (100 / this.listfields.length) + '%';
    }

    /**
     * returns if a given fielsd is set sortable in teh fieldconfig
     *
     * @param field the field from the fieldset
     */
    public isSortable(field): boolean {
        if (field.fieldconfig.sortable === true) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * sets the field as sort parameter
     *
     * @param field the field from the fieldset
     */
    public setSortField(field): void {
        if (this.isSortable(field)) {
            this.modellist.setSortField(field.field);
            if (this.reloadTimeOut) window.clearTimeout(this.reloadTimeOut);
            this.reloadTimeOut = window.setTimeout(() => this.modellist.reLoadList(), 500);
        }
    }

    public onresize(e) {
        let elementWidths = {};
        let totalwidth = 0;

        this.resizeElements.forEach(element => {
            let elementWidth = element.getElementWidth();
            totalwidth += elementWidth;
            elementWidths[element.resizeid] = element.getElementWidth();
        });

        for (let listfield of this.listfields) {
            listfield.width = Math.round((elementWidths[listfield.id] / totalwidth) * 100);
        }
    }
}
