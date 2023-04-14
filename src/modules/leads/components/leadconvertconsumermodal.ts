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
    selector: 'lead-convert-consumer-modal',
    templateUrl: '../templates/leadconvertconsumermodal.html',
    providers: [model, view]
})
export class LeadConvertConsumerModal implements OnInit, AfterViewInit {

    /**
     * reference to the modal itself
     */
    public self: any = {};

    /**
     * ebent emitter when the conversion is completed
     */
    @Output() public converted: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the componentset to be rendered
     */
    public componentSet: string;

    constructor(public language: language, @SkipSelf() public lead: model, public model: model, public metadata: metadata, public view: view, public modal: modal) {
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
                    email_address_caps: this.lead.getField('email1').toUpperCase(),
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
    public close() {
        this.self.destroy();
    }

    /**
     * converts the lead to a consumer
     */
    public convert() {
        if (!this.model.validate()) return;
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            loadingModalRef.instance.messagelabel = 'creating Consumer';
            this.model.save().subscribe(consumer => {
                loadingModalRef.instance.messagelabel = 'updating Lead';
                this.lead.setField('status', 'Converted');
                this.lead.setField('consumer_id', this.model.id);
                this.lead.save().subscribe(leaddata => {
                    this.lead.setData(leaddata);
                    loadingModalRef.instance.self.destroy();
                    this.close();
                });
            });
        });
    }

}
