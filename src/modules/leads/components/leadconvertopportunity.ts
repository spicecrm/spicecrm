 /**
 * @module ModuleLeads
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    SkipSelf
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

/**
 * the panel to convert the lead to an opportunity
 */
@Component({
    selector: 'lead-convert-opportunity',
    templateUrl: '../templates/leadconvertopportunity.html',
    providers: [view, model]
})
export class LeadConvertOpportunity implements AfterViewInit {

    /**
     * the container ref to render the detailed view in
     */
    @ViewChild('detailcontainer', {read: ViewContainerRef, static: true}) public detailcontainer: ViewContainerRef;

    /**
     * EventEmitter to emit the created opportunity
     */
    @Output() public opportunity: EventEmitter<model> = new EventEmitter<model>();

    /**
     * the component config
     */
    public componentconfig: any = {};

    /**
     * reference to the various compoentnes rendered as part of the detailed componentset
     */
    public componentRefs: any = [];

    /**
     * internal boolean flag to allow the user to select if an opportunity shoudl be created
     */
    public createOpportunity: boolean = false;

    /**
     * returns if the flag is set
     */
    get create() {
        return this.createOpportunity;
    }

    /**
     * set the flag and if set emit the model or null to the main cobversion component
     *
     * @param value
     */
    set create(value) {
        this.createOpportunity = value;

        if (value == false) {
            this.opportunity.emit(null);
            this.lead.setFields({
                opportunity_id: undefined
            });
        } else {
            this.opportunity.emit(this.model);
        }
    }

    constructor(public view: view, public metadata: metadata, @SkipSelf() public lead: model, public model: model, public language: language) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        this.initializeFromLead();
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    /**
     * initialize the Opportunity from the Lead
     * also subscribes to the lead in case the account id changes to get the updated account id to link the opportunity to
     */
    public initializeFromLead() {
        this.model.module = 'Opportunities';
        this.model.initialize(this.lead);
        this.lead.data$.subscribe(data => {
            if (data.account_id != this.model.getField('account_id') || data.account_linked_name != this.model.getField('account_linked_name')) {
                this.model.setFields({
                    account_id: data.account_id,
                    account_name: data.account_linked_name
                });
            }
        });

        /**
         * make sure we update the lead with the link
         */
        this.model.data$.subscribe(data => {
            if(this.lead.getField('opportunity_id') != data.id) {
                this.lead.setFields({
                    opportunity_id: data.id
                });
            }
        });

        // emit the model
        if(this.createOpportunity) {
            this.opportunity.emit(this.model);
        }
    }

    /**
     * builds the container
     */
    public buildContainer() {
        // Close any already open dialogs
        // this.container.clear();
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance.componentconfig = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }
}
