/**
 * @module ModuleLeads
 */
import {
    Component,
    Output,
    EventEmitter,
    OnInit,
    ViewContainerRef,
    ViewChild,
    AfterViewInit, SkipSelf
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {SystemLoadingModal} from "../../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'lead-convert-opportunity-modal',
    templateUrl: '../templates/leadconvertopportunitymodal.html',
    providers: [model, view]
})
export class LeadConvertOpportunityModal implements OnInit, AfterViewInit {

    @ViewChild('detailcontainer', {read: ViewContainerRef, static: true})  public detailcontainer: ViewContainerRef;

    public self: any = {};
    @Output() public converted: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the componentset to be rendered
     */
    public componentSet: string;

    constructor(public language: language, @SkipSelf() public lead: model, public model: model, public metadata: metadata, public view: view, public modal: modal) {
        this.model.module = 'Opportunities';
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        this.model.initialize(this.lead);
    }

    public ngAfterViewInit(){
        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        this.componentSet = componentconfig.componentset;
    }

    public close() {
        this.self.destroy();
    }

    /**
     * converts the lead to an opportunity
     */
    public convert() {
        if ( !this.model.validate() ) return;
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            loadingModalRef.instance.messagelabel = 'creating Opportunity';
            this.model.save().subscribe(done => {
                loadingModalRef.instance.messagelabel = 'updating Lead';
                this.lead.setField('status', 'Converted');
                this.lead.setField('opportunity_id', this.model.id);
                this.lead.setField('opportunity_name', this.model.getFieldValue('name'));
                this.lead.save().subscribe(leadsaved => {
                    loadingModalRef.instance.self.destroy();
                    this.close();
                });
            });
        });
    }

}
