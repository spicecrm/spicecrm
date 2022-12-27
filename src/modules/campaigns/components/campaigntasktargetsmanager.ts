/**
 * @module ModuleCampaigns
 */
import {
    Component, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import { Params} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {language} from '../../../services/language.service';
import {layout} from '../../../services/layout.service';
import {backend} from '../../../services/backend.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * allows management of targets in multiple targetlists on a campaigntask
 */
@Component({
    selector: 'campaigntask-target-manager',
    templateUrl: '../templates/campaigntasktargetsmanager.html',
    providers: [model]
})
export class CampaignTaskTargetsManager implements OnInit, OnDestroy {
    /**
     * a reference to the list container. Required to have a scroll handle and do the infinite scrolling
     */
    @ViewChild('listContainer', {read: ViewContainerRef, static: true}) public listContainer: ViewContainerRef;

    private _searchterm: string = '';
    /**
     * a subscription to cath the loading event
     */
    public subscription: any;

    public componentconfig: any;

    public prospectLists: any[] = [];
    public prospects: any[] = [];
    public loading: boolean = false;

    constructor(public metadata: metadata, public backend: backend, public modal: modal, public parent: model, public language: language,  public navigationtab: navigationtab, public layout: layout) {

        // check the componentconfig wether to use fts or not
    }

    public ngOnInit(): void {
        // initialize the tab
        this.initialize(this.navigationtab.activeRoute.params);
    }

    /**
     * handles the destory and unsubscribes from the activitiy service
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    get searchterm() {
        return this._searchterm;
    }

    set searchterm(seacrhterm) {
        this._searchterm = seacrhterm;
    }

    public reload(){
        console.log('reload');
    }

    public add(){
        console.log('add');
    }

    public getStatus(record){
        let val = Math.round(Math.random() * 3);
        switch (val){
            case 2:
                return 'error';
            case 1:
                return 'ok';
            default:
                return 'none';
        }
    }

    /**
     * initializes when the activated Route returns the promise in the constructor
     *
     * @param params the Route Params returned
     */
    public initialize(params: Params) {
        // get the bean details
        this.parent.module = params.module;
        this.parent.id = params.id;
        this.parent.getData(true, '', true).subscribe(data => {
            // set the tab params
            this.navigationtab.setTabInfo({displayname: this.parent.getField('summary_text') + ' • ' + this.language.getLabel('LBL_MANAGE_TARGETS'), displaymodule: 'ProspectLists'});
        });

        this.loading = true;
        let awaitModal = this.modal.await('LBL_LOADING');
        this.backend.getRequest(`module/${this.parent.module}/${this.parent.id}/targets`).subscribe({
            next: (res) => {
                this.prospectLists = res.prospectlists;
                this.prospects = res.prospects;

                for(let p of this.prospects){
                    p.status = this.getStatus(p);
                }

                awaitModal.emit(true);
                this.loading = false;
            },
            error: () => {
                awaitModal.emit(true);
                this.loading = false;
            }
        })
    }

    public onScroll(){

    }

    public getProspectListsDisplay(prospectlists){
        let list = [];
        for(let pl of prospectlists){
            list.push(this.prospectLists.find(p => p.id == pl).name);
        }
        return list.join(', ');
    }

    /**
     * navigates to the parent model record. Used in the breadcrumbs
     */
    public goModel() {
        this.parent.goDetail();
    }

    /**
     * navigates to the parent module. Used in the breadcrumbs
     */
    public goModule() {
        this.parent.goModule();
    }
}
