/**
 * @module ObjectComponents
 */
import {Component, ViewChild, ViewContainerRef, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {modellist} from '../../services/modellist.service';

@Component({
    selector: 'object-list',
    templateUrl: './src/objectcomponents/templates/objectlist.html'
})
export class ObjectList implements OnDestroy {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;

    private allFields: any[] = [];
    private listFields: any[] = [];
    private module: string = '';
    private modellistsubscribe: any = undefined;
    public componentconfig: any = {};

    get actionset() {
        return this.componentconfig.actionset;
    }

    get rowselect() {
        return true;
    }

    get isloading() {
        return this.modellist.isLoading;
    }

    constructor(private router: Router, private metadata: metadata, private modellist: modellist, private language: language, private layout: layout) {
        // set the module
        this.module = this.modellist.module;

        // load the list intiially
        this.setFieldDefs();

        // set the limit for the loading
        this.modellist.loadlimit = 50;

        // load the list and initialize from sesson data if this is set
        this.loadList(true);

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());
    }

    get inlineedit() {
        return this.componentconfig.inlineedit;
    }

    get issmall() {
        return this.layout.screenwidth == 'small';
    }

    get sortfield() {
        return this.componentconfig.sortfield;
    }

    get sortdirection() {
        return this.componentconfig.sortdirection ? this.componentconfig.sortdirection : 'ASC';
    }

    public ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();
    }

    private switchListtype() {
        this.setFieldDefs();
        this.loadList();
    }

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


    private navigateDetail(id) {
        this.router.navigate(['/module/' + this.module + '/' + id]);
    }

    private loadList(loadfromcache: boolean = false) {

        if (this.modellist.listData.listcomponent != 'ObjectList') {
            let requestedFields = [];
            for (let entry of this.allFields) {
                requestedFields.push(entry.field);
            }
            if (this.sortfield) {
                this.modellist.setSortField(this.sortfield, this.sortdirection, false);
            }
            this.modellist.getListData(requestedFields, loadfromcache);
        }
    }

//
    private onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }
}
