/**
 * @module ModuleLeads
 */
import {Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

@Component({
    selector: 'lead-convert-opportunity',
    templateUrl: './src/modules/leads/templates/leadconvertopportunity.html',
    providers: [view, model]
})
export class LeadConvertOpportunity implements AfterViewInit {
    @ViewChild('detailcontainer', {read: ViewContainerRef, static: false}) detailcontainer: ViewContainerRef;

    @Input() lead: model = undefined;

    @Output() opportunity: EventEmitter<model> = new EventEmitter<model>();
    @Output() createopportunity: EventEmitter<boolean> = new EventEmitter<boolean>();


    initialized: boolean = false;
    componentSet: string = '';
    componentconfig: any = {};
    componentRefs: any = [];

    // create flag and getter and setter for the checkbox
    createOpportunity: boolean = false;

    get create() {
        return this.createOpportunity;
    }

    set create(value) {
        this.createOpportunity = value;
        this.createopportunity.emit(value);
    }

    constructor(private view: view, private metadata: metadata, private model: model) {
        this.model.module = 'Opportunities';
        this.model.initializeModel();
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    ngOnInit() {
        this.lead.data$.subscribe(data => {
            this.model.data.amount = data.opportunity_amount;
            this.model.data.campaign_name = data.campaign_name;
            this.model.data.campaign_id = data.campaign_id;
        });
        this.opportunity.emit(this.model);
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    buildContainer() {
        // Close any already open dialogs
        // this.container.clear();
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }
}