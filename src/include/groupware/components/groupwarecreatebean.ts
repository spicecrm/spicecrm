import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {GroupwareService} from "../services/groupware.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'groupware-create-bean',
    templateUrl: '../templates/groupwarecreatebean.html',
    providers: [view, model]
})

export class GroupwareCreateBean implements OnInit {

    /**
     * component config
     */
    public componentConfig: { componentset: string };
    /**
     * on save or cancel emit the action
     * @private
     */
    @Output() private action$ = new EventEmitter<{id: string}>();
    /**
     * bean module
     * @private
     */
    @Input() private module: string;

    constructor(private metadata: metadata,
                private view: view,
                private groupware: GroupwareService,
                private modal: modal,
                public model: model) {
    }

    /**
     * load the component config
     */
    public loadComponentConfig() {

        this.componentConfig = this.metadata.getComponentConfig('GroupwareCreateBean', this.model.module);

        if (!this.componentConfig.componentset) {
            this.componentConfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        }
    }

    public ngOnInit() {
        this.view.isEditable = true;
        this.model.module = this.module;
        this.model.initialize();
        this.model.startEdit();
        this.groupware.getAddressArray().subscribe(addresses => {
            this.model.setField('email1', addresses[0]);
            this.model.addRelatedRecords('email_addresses', addresses.map((address, index) => ({
                id: this.model.generateGuid(),
                primary_address: index == 0 ? 1: 0,
                email_address: address,
                email_address_caps: address.toUpperCase(),
            })));

        });

        this.loadComponentConfig();
        this.view.setEditMode();
    }

    public save() {
        if (!this.model.validate()) return false;

        const isSaving = this.modal.await('LBL_SAVING_DATA');

        this.model.save(true).subscribe({
            next: res => {
                isSaving.next(true);
                isSaving.complete();
                const bean = {
                    id: this.model.id,
                    module: this.model.module,
                    data: this.model.data,
                };
                this.groupware.relatedBeans.push(bean);
                this.action$.emit(bean);
            },
            error: () => {
                isSaving.next(false);
                isSaving.complete();
            }
        });
    }

    public cancel() {
        this.action$.emit();
    }
}