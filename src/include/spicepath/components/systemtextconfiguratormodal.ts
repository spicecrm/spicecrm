import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'system-text-configurator-modal',
    templateUrl: '../templates/systemtextconfiguratormodal.html',
    providers: [view]
})

export class SystemTextConfiguratorModal implements OnInit {

    /**
     * holds modal instance
     */
    public self: any;

     /**
     * holds text_id value
     * max. 36 characters, must be unique
     * i.e. pg-000-001
     */
    public textId: string = '';

    /**
     * name of the systext
     */
    public sysTextName: string = '';

    /**
     * module name
     */
    public module: string = 'SpiceBeanGuides';

    /**
     * holds the label name
     */
    public label: string = '';

    /**
     * event emitter for the response
     */
    @Output() public answer: EventEmitter<any> = new EventEmitter<any>();


    constructor (
        public backend: backend,
        public language: language,
        public view: view,
        public toast: toast,
        public modal: modal
    ) { }

    ngOnInit(): void {
        this.view.setEditMode();
        this.view.isEditable = true;
    }

    /**
     * checks if we can save
     */
    get canSave(): boolean {
        return this.textId.length > 1 && this.sysTextName.length > 1 && this.module.length > 1 && this.label.length > 1;
    }

    /**
     * saving the data in systextids & systextids_modules tables
     */
    public save(): void {
        let spinner = this.modal.await('LBL_SAVING');

        const body = {
            textId: this.textId,
            name: this.sysTextName,
            module: this.module,
            label: this.label
        };

        this.backend.postRequest('/system/spiceuisystextids/core/addsystext', {}, body).subscribe( {
            next: (response) => {
                this.answer.emit(response.textId);
                spinner.emit(true);
                this.close();
                this.toast.sendToast('LBL_SYSTEXTID_SAVED', "success");
            }, error: (err) => {
                spinner.emit(true);
                this.toast.sendToast('LBL_ERROR_SAVING_SYSTEXTID', "error", err);
            }
        })
    }

    /**
     * closing modal
     */
    public close(): void {
        this.view.isEditable = false;
        this.self.destroy();
    }

}