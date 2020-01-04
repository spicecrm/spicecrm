/**
 * @module ObjectComponents
 */
import {Component, ViewChild, ViewContainerRef, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {modellist} from '../../services/modellist.service';

/**
 * renders the modellist
 */
@Component({
    selector: 'object-list',
    templateUrl: './src/objectcomponents/templates/objectlist.html'
})
export class ObjectList implements OnDestroy {

    /**
     * the element reference for the content of the view
     */
    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;

    /**
     * all fields that are available
     */
    private allFields: any[] = [];

    /**
     * the fields to be displayed
     */
    private listFields: any[] = [];

    /**
     * the subscription to the modellist
     */
    private modellistsubscribe: any = undefined;

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * returns the actionset from the config
     */
    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * returns if the listservic eis loading
     */
    get isloading() {
        return this.modellist.isLoading;
    }

    constructor(private router: Router, private metadata: metadata, private modellist: modellist, private language: language, private layout: layout) {

        // load the list intiially
        this.setFieldDefs();

        // set the limit for the loading
        this.modellist.loadlimit = 50;

        // load the list and initialize from sesson data if this is set
        this.loadList(true);

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());
    }

    /**
     * getter if the listconfig allows inline editing
     */
    get inlineedit() {
        return this.componentconfig.inlineedit;
    }

    /**
     * a getter if the view is considered small
     * to render the view properly
     */
    get issmall() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * returns the sortfield from the config
     */
    get sortfield() {
        return this.componentconfig.sortfield;
    }

    /**
     * returns the sortdirection from the componentconfig
     */
    get sortdirection() {
        return this.componentconfig.sortdirection ? this.componentconfig.sortdirection : 'ASC';
    }

    /**
     * unsubscribe from the modellist subscription
     */
    public ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();
    }

    /**
     * handle the listtype when this is switched and reload the listdefs and the listdata
     */
    private switchListtype() {
        this.setFieldDefs();
        this.loadList();
    }

    /**
     * load the fieldddefs
     */
    private setFieldDefs(): void {
        this.listFields = [];

        // check if we have fielddefs
        let fielddefs = this.modellist.getFieldDefs();
        // load all fields
        this.componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
        this.allFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);
        for (let listField of this.allFields) {
            if ((fielddefs.length > 0 && fielddefs.indexOf(listField.field) >= 0) || (fielddefs.length === 0 && listField.fieldconfig.default !== false)) {
                this.listFields.push(listField);
            }
        }

        // sort the fields properly
        if (fielddefs.length > 0) {
            this.listFields.sort((a, b) => {
                return fielddefs.indexOf(a.field) - fielddefs.indexOf(b.field);
            });
        }
    }

    /**
     * function to load the listdata. Checks on the listdata if the component is the same .. if yes .. no reload is needed
     * this can happen when the list is loaded from the appdata service that cahces the previous list
     *
     * @param loadfromcache
     */
    private loadList(loadfromcache: boolean = false) {

        if (this.modellist.listData.listcomponent != 'ObjectList') {
            let requestedFields = [];
            for (let entry of this.allFields) {
                requestedFields.push(entry.field);
            }
            if (this.sortfield) {
                this.modellist.setSortField(this.sortfield, this.sortdirection, false);
            }
            this.modellist.getListData(requestedFields);
        }
    }

    /**
     * manages the scroll event for the infinited Scroll
     *
     * @param e
     */
    private onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }

    /**
     * trackby function to opütimize performnce onm the for loop
     *
     * @param index
     * @param item
     */
    protected trackbyfn(index, item) {
        return item.id;
    }
}
