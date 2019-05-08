/**
 * @module ObjectComponents
 */
import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {navigation} from '../../services/navigation.service';
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
    templateUrl: './src/objectcomponents/templates/objectrelatedlistall.html',
    providers: [model, relatedmodels]
})
export class ObjectRelatedlistAll implements OnInit {

    /**
     * the content container required to load more when scrolled
     */
    @ViewChild('tablecontent', {read: ViewContainerRef}) private tablecontent: ViewContainerRef;

    /**
     * the module
     */
    private module = '';

    /**
     * the id of the record
     */
    private id = '';

    /**
     * a linkname if a specific link is to be used
     */
    private link = '';

    /**
     * the related module
     */
    private related = '';

    /**
     * the fieldset to be used
     */
    private fieldset: string = undefined;

    /**
     * the component configuration
     */
    private componentconfig: any = {};

    /**
     * the fields to be used
     */
    private listfields: any[] = [];

    constructor(private activatedRoute: ActivatedRoute, private navigation: navigation, private language: language, private metadata: metadata, private model: model, private relatedmodels: relatedmodels) {

    }

    /**
     * load teh info from teh rtelated route and load the related models initially
     */
    public ngOnInit() {
        this.module = this.activatedRoute.params['value']['module'];
        this.link = this.activatedRoute.params['value']['link'];
        this.related = this.activatedRoute.params['value']['related'];
        this.fieldset = this.activatedRoute.params['value']['fieldset'];

        // set theenavigation paradigm
        this.navigation.setActiveModule(this.module);

        // get the bean details
        this.model.module = this.module;
        this.model.id = this.activatedRoute.params['value']['id'];

        this.model.getData(true, 'detailview').subscribe(data => {
            this.navigation.setActiveModule(this.module, this.model.id, data.summary_text);
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
        } else if (this.model.fields[this.relatedmodels._linkName].sequence_field) {
            this.relatedmodels.sequencefield = this.model.fields[this.relatedmodels._linkName].sequence_field;
        }
        this.relatedmodels.getData();
    }

    /**
     * navigates to the listview of the parent module
     *
     * used in the breadcrumbs
     */
    private goModule() {
        this.model.goModule();
    }

    /**
     * navigates to the model
     */
    private goModel() {
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
    private onScroll(e) {
        if(this.relatedmodels.canloadmore) {
            let element = this.tablecontent.element.nativeElement;
            if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
                this.relatedmodels.getMoreData(25);
            }
        }
    }

}
