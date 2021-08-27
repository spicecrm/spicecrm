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
    templateUrl: './src/modules/leads/templates/leadconvertopportunitymodal.html',
    providers: [model, view]
})
export class LeadConvertOpportunityModal implements OnInit, AfterViewInit {

    @ViewChild('detailcontainer', {read: ViewContainerRef, static: true})  private detailcontainer: ViewContainerRef;

    private self: any = {};
    @Output() private converted: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the componentset to be rendered
     */
    private componentSet: string;

    constructor(private language: language, @SkipSelf() private lead: model, private model: model, private metadata: metadata, private view: view, private modal: modal) {
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

    private close() {
        this.self.destroy();
    }

    /**
     * converts the lead to an opportunity
     */
    private convert() {
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
