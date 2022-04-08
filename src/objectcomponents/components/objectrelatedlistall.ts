/**
 * @module ObjectComponents
 */
import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {navigationtab} from '../../services/navigationtab.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

/**
 * @ignore
 */
declare var _;

/**
 * displays all related models .. navigated to via a separate route
 */
@Component({
    selector: 'object-relatedlist-all',
    templateUrl: '../templates/objectrelatedlistall.html',
    providers: [model, relatedmodels]
})
export class ObjectRelatedlistAll implements OnInit {

    /**
     * the content container required to load more when scrolled
     */
    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) public tablecontent: ViewContainerRef;

    /**
     * the module
     */
    public module = '';

    /**
     * the id of the record
     */
    public id = '';

    /**
     * a linkname if a specific link is to be used
     */
    public link = '';

    /**
     * the related module
     */
    public related = '';

    /**
     * the fieldset to be used
     */
    public fieldset: string = undefined;

    /**
     * the component configuration
     */
    public componentconfig: any = {};

    /**
     * the fields to be used
     */
    public listfields: any[] = [];

    constructor(public navigationtab: navigationtab, public language: language, public metadata: metadata, public model: model, public relatedmodels: relatedmodels) {

    }

    /**
     * load teh info from teh rtelated route and load the related models initially
     */
    public ngOnInit() {
        this.module = this.navigationtab.activeRoute.params.module;
        this.link = this.navigationtab.activeRoute.params.link;
        this.related = this.navigationtab.activeRoute.params.related;
        this.fieldset = this.navigationtab.activeRoute.params.fieldset;


        // get the bean details
        this.model.module = this.module;
        this.model.id = this.navigationtab.activeRoute.params.id;

        this.model.getData(true, 'detailview').subscribe(data => {
            this.navigationtab.setTabInfo({displaymodule: this.module, displayname: data.summary_text + ' • ' + this.language.getModuleName(this.related)});
        });

        // load the config and fieldset
        this.componentconfig = this.metadata.getComponentConfig('ObjectRelatedlistAll', this.related);
        // if nothing is defined, try to take the default list config...
        if (!this.componentconfig.fieldset) {
            this.componentconfig = this.metadata.getModuleDefaultComponentConfigByUsage(this.related, 'list');
        }

        if (_.isEmpty(this.componentconfig)) {
            console.warn(`no componentconfig found for ObjectRelatedlistAll nor ObjectList with module ${this.related}`);
        }

        this.listfields = this.metadata.getFieldSetFields(this.fieldset ? this.fieldset : this.componentconfig.fieldset);
        if (_.isEmpty(this.listfields)) {
            console.warn('no fieldset to use!');
        }

        // load the related data
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = this.related ;
        this.relatedmodels.linkName = this.link;
        this.relatedmodels.loaditems = 50;
        if (this.componentconfig.sequencefield) {
            this.relatedmodels.sequencefield = this.componentconfig.sequencefield;
        } else if (this.model.fields[this.relatedmodels._linkName]?.sequence_field) {
            this.relatedmodels.sequencefield = this.model.fields[this.relatedmodels._linkName].sequence_field;
        }
        this.relatedmodels.getData();
    }

    /**
     * navigates to the listview of the parent module
     *
     * used in the breadcrumbs
     */
    public goModule() {
        this.model.goModule();
    }

    /**
     * navigates to the model
     */
    public goModel() {
        this.model.goDetail();
    }

    /**
     * retirves the title to be displayed
     */
    get listingTitle() {
        if (this.metadata.fieldDefs[this.model.module][this.link].vname) return this.language.getLabel(this.metadata.fieldDefs[this.model.module][this.link].vname);
        return this.language.getModuleName(this.related);
    }

    /**
     * triggered on scroll to handle infinite scrolling when the user scrolls and more items can be loaded
     * @param e
     */
    public onScroll(e) {
        if(this.relatedmodels.canloadmore) {
            let element = this.tablecontent.element.nativeElement;
            if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
                this.relatedmodels.getMoreData(25);
            }
        }
    }

}
