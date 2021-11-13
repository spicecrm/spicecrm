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
    templateUrl: './src/modules/leads/templates/leadconvertconsumermodal.html',
    providers: [model, view]
})
export class LeadConvertConsumerModal implements OnInit, AfterViewInit {

    /**
     * reference to the modal itself
     */
    private self: any = {};

    /**
     * ebent emitter when the conversion is completed
     */
    @Output() private converted: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the componentset to be rendered
     */
    private componentSet: string;

    constructor(private language: language, @SkipSelf() private lead: model, private model: model, private metadata: metadata, private view: view, private modal: modal) {
        this.model.module = 'Consumers';
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        this.model.initialize(this.lead);

        this.model.initializeField(
            'email_addresses',
            {"beans": [{
                    id: this.model.generateGuid(),
                    bean_id: this.model.id,
                    bean_module: this.model.module,
                    email_address: this.lead.getField('email1'),
                    email_address_id: '',
                    primary_address: '1'
                }]}
        );
    }

    public ngAfterViewInit() {
        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        this.componentSet = componentconfig.componentset;
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * converts the lead to a consumer
     */
    private convert() {
        if (!this.model.validate()) return;
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            loadingModalRef.instance.messagelabel = 'creating Consumer';
            this.model.save().subscribe(consumer => {
                loadingModalRef.instance.messagelabel = 'updating Lead';
                this.lead.setField('status', 'Converted');
                this.lead.setField('consumer_id', this.model.id);
                this.lead.save().subscribe(leaddata => {
                    this.lead.data = this.lead.utils.backendModel2spice('Leads', leaddata);
                    loadingModalRef.instance.self.destroy();
                    this.close();
                });
            });
        });
    }

}
