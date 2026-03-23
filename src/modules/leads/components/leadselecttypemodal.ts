/**
 * @module ModuleLeads
 */
import {Component, Input, Output, EventEmitter, OnInit, Injector, signal, inject} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {BehaviorSubject, Observable, Subject, switchMap} from "rxjs";
import {view} from "../../../services/view.service";
import {GenerativeAIInputI} from "../../../systemcomponents/interfaces/systemcomponents.interfaces";
import {tap} from "rxjs/operators";
import {backend} from "../../../services/backend.service";

/**
 * a separet modal to display the steps for th elad comversion as well as the progress
 */
@Component({
    selector: 'lead-select-type-modal',
    templateUrl: '../templates/leadselecttypemodal.html',
    providers: [view],
    standalone: false
})
export class LeadSelectTypeModal {

    /**
     * reference to the modal itsefl
     */
    public self: any;

    /**
     * the fieldset to be rendered
     */
    public fieldset: string;
    /**
     * lead file
     */
    public leadFile = signal<any>(undefined);
    /**
     * reference to the generative ai service
     * @private
     */
    private backend = inject(backend);
    /**
     * id of the AI prompt for generating the lead from file
     */
    public promptId = signal<string>(undefined);

    constructor(public injector: Injector, public metadata: metadata, public view: view, public language: language, public modal: modal, public model: model) {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.fieldset = this.metadata.getComponentConfig('LeadSelectTypeModal', 'Leads').fieldset;
        const config = this.metadata.getComponentConfig('LeadSelectTypeModal', 'Leads');
        this.promptId.set(config.promptId);
    }

    /**
     * simple getter to enable the create button
     */
    get cancreate() {
        return !!this.model.getField('lead_type');
    }

    /**
     * trigger creating the new lead
     */
    public create() {
        if(this.cancreate) {
            this.modal.openModal("ObjectEditModal", true, this.injector);
            this.close();
        }
    }

    public scanBusinessCard(){
        if(this.cancreate) {
            this.modal.openModal("LeadScanBusinessCardModal", true, this.injector);
            this.close();
        }
    }

    /**
     * create a new lead from a file
     * @param file
     */
    public createLeadFromFile(file: { file_name: string, file_mime_type: string, file: string, progressSubscription: BehaviorSubject<number>}) {

        const body = {
            filename: file.file_name,
            file: file.file,
            mime: file.file_mime_type
        };

        const processing = this.modal.await('LBL_PROCESSING');

        this.backend.postRequestWithProgress(`module/Leads/generateai/${this.promptId()}`, null, body, file.progressSubscription)
            .subscribe({
                next: res => {
                    file.progressSubscription.complete();
                    processing.next(true);
                    processing.complete();
                    this.model.id = res.id;
                    this.model.goDetail();
                    this.close();
                },
                error: () => {
                    file.progressSubscription.complete();
                    processing.next(true);
                    processing.complete();
                    this.modal.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                }
            });
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
}
