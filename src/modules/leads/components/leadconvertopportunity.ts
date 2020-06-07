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

@Component({
    selector: 'lead-convert-opportunity',
    templateUrl: './src/modules/leads/templates/leadconvertopportunity.html',
    providers: [view, model]
})
export class LeadConvertOpportunity implements AfterViewInit {
    @ViewChild('detailcontainer', {read: ViewContainerRef, static: true}) private detailcontainer: ViewContainerRef;


    @Output() public opportunity: EventEmitter<model> = new EventEmitter<model>();


    private componentSet: string = '';
    private componentconfig: any = {};
    private componentRefs: any = [];

    // create flag and getter and setter for the checkbox
    private createOpportunity: boolean = false;

    get create() {
        return this.createOpportunity;
        this.opportunity.emit(this.model);
    }

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

    constructor(private view: view, private metadata: metadata, @SkipSelf() private lead: model, private model: model, private language: language) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        this.initializeFromLead();
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }


    private initializeFromLead() {
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

    private buildContainer() {
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
