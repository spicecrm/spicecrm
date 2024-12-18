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

@Component({
    selector: 'kpis-related-container',
    templateUrl: '../templates/kpisrelatedcontainer.html',
    providers: [relatedmodels]
})

export class KPIsRelatedContainer {

    /**
     * indicates that we are loading
     */
    public loading: boolean = true;

    public loaded: boolean = false;

    /**
     * the other targets
     */
    public targets: any[] = [];

    private loadsubscription: Subscription = new Subscription()

    constructor(
        public session: session,
        public backend: backend,
        public toast: toast,
        public layout: layout,
        public modal: modal,
        public model: model,
        public elementRef: ElementRef,
        public relatedmodels: relatedmodels
    ) {
    }

    /**
     * laod config, initialize the related model service and load the related records
     */
    public ngOnInit() {

        // Initialize the related Model Service
        this.initializeRelatedModelService();

        this.loadsubscription = this.model.data$.subscribe(modeldata => {
            this.loadRelated();
        });

    }

    /**
     * initializes the related model service
     */
    public initializeRelatedModelService() {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;

        // pass in the model
        this.relatedmodels.model = this.model;

        // set the related model from teh config
        this.relatedmodels.relatedModule = 'KPITargets';

    }

    /**
     * loads the related records
     */
    public loadRelated() {
        if (this.loaded) return;

        this.loaded = true;

        // unsubscribe if we loaded once
        this.loadsubscription.unsubscribe();

        // reload
        this.targets = [];
        this.relatedmodels.getData().subscribe({
            next: () => {
                this.relatedmodels.items.forEach(i => {
                    i.kpi = {...this.model.data};
                    i.kpi.display_label = i.parent_name;
                    this.targets.push(i);
                })
                this.targets.sort((a, b) => a.kpi.display_label.localeCompare(b.kpi.display_label));
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
}