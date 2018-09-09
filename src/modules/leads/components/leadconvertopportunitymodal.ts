import {
    Component,
    Input,
    HostBinding,
    Output,
    EventEmitter,
    OnInit,
    ViewContainerRef,
    ViewChild,
    AfterViewInit
} from '@angular/core';
import {Router} from '@angular/router';
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

    @ViewChild('detailcontainer', {read: ViewContainerRef}) detailcontainer: ViewContainerRef;

    self: any = {};
    lead: model;
    @Output() converted: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private model: model, private metadata: metadata, private view: view, private modal: modal) {
        this.model.module = 'Opportunities';
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    ngOnInit() {
        this.model.initialize(this.lead);
    }

    ngAfterViewInit(){
        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        let componentSet = componentconfig.componentset;

        for (let panel of this.metadata.getComponentSetObjects(componentSet)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = panel.componentconfig;
            });
        }
    }

    close() {
        this.self.destroy();
    }

    convert() {
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

    onModalEscX() {
        this.close();
    }

}
