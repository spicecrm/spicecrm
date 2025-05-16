/**
 * @module ModuleKPIs
 */

import {Component, ElementRef, Input, OnChanges} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {session} from "../../../services/session.service";
import {layout} from "../../../services/layout.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {Subscription} from "rxjs";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'kpis-related-container',
    templateUrl: '../templates/kpisrelatedcontainer.html',
    providers: [relatedmodels]
})

export class KPIsRelatedContainer {

    /**
     * indicates that we are loading
     */
    public loading: boolean = false;

    /**
     * a searchterm to filter by
     */
    public searchTerm: string = '';

    /**
     * the other targets
     */
    public targets: any[] = [];

    /**
     * decide if a user can recalculate
     */
    public canRecalculate: boolean = false;

    constructor(
        public session: session,
        public backend: backend,
        public toast: toast,
        public layout: layout,
        public modal: modal,
        public model: model,
        public metadata: metadata,
        public elementRef: ElementRef,
        public relatedmodels: relatedmodels
    ) {
        this.canRecalculate = this.metadata.checkModuleAcl('KPITargetValues', 'create');
    }

    /**
     * laod config, initialize the related model service and load the related records
     */
    public ngOnInit() {

        // Initialize the related Model Service
        this.initializeRelatedModelService();

        // load the related models
        this.loadRelated();
    }



    /**
     * initializes the related model service
     */
    public initializeRelatedModelService() {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;

        // pass in the model
        this.relatedmodels.model = this.model;

        // set the max loaded number
        this.relatedmodels.loaditems = 200;

        // set the related model from teh config
        this.relatedmodels.relatedModule = 'KPITargets';

    }

    /**
     * returns filtered targets
     */
    get filteredTargets(){
        return !!this.searchTerm ? this.targets.filter(t => t.kpi.display_label.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0) : this.targets;
    }

    /**
     * to reload the targets
     */
    public reload(){
        this.searchTerm = '';
        this.loadRelated();
    }

    /**
     * loads the related records
     */
    public loadRelated() {
        if(this.loading) return;

        // reload
        this.targets = [];
        this.loading = true;
        this.relatedmodels.getData().subscribe({
            next: () => {
                this.loading = false;
                this.relatedmodels.items.forEach(i => {
                    i.kpi = {...this.model.data};
                    i.kpi.display_label = i.parent_name;
                    this.targets.push(i);
                })
                this.targets.sort((a, b) => a.kpi.display_label.localeCompare(b.kpi.display_label));
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    /**
     * calculate amount of tiles displayed
     * depending on screen width
     */
    get getTileWidthClass() {
        let dim = this.elementRef.nativeElement.getBoundingClientRect()
        let count = Math.floor(dim.width / 350);
        return dim.width > 350 ?  'slds-size--1-of-' + count : 'slds-size--1-of-1';
    }

    /**
     * recalculates the KPI
     */
    public reCalculate(){
        if(this.canRecalculate){
            let awaitModal = this.modal.await('LBL_RECALCULATING');
           this.backend.postRequest(`module/KPIs/${this.model.id}/recalculate`).subscribe({
               next: () => {
                   awaitModal.emit(true);
                   this.reload();
               },
               error: () => {
                   awaitModal.emit(true);
               }
           })
        }
    }
}