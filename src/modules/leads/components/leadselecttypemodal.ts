/**
 * @module ModuleLeads
 */
import {Component, Input, Output, EventEmitter, OnInit, Injector, signal, inject} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {Observable, Subject, switchMap} from "rxjs";
import {view} from "../../../services/view.service";
import {GenerativeAIService} from "../../../services/generativeai.service";
import {GenerativeAIInputI} from "../../../systemcomponents/interfaces/systemcomponents.interfaces";
import {tap} from "rxjs/operators";

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
    private generativeAIService = inject(GenerativeAIService);
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
    public createLeadFromFile(file: { file_name: string, file_mime_type: string, file_md5?: string, file_size?: string, remove: () => void}) {

        const input: GenerativeAIInputI[] = [{type: 'file', md5: file.file_md5, mime: file.file_mime_type}];
        const processing = this.modal.await('LBL_PROCESSING');

        this.generativeAIService.submitPromptWithInputs(this.promptId(), input, true)
            .pipe(
                tap(res => this.model.setFields(res[0])),
                switchMap(() => this.model.save(true))
            )
            .subscribe({
                next: () => {
                    processing.next(true);
                    processing.complete();
                    this.model.goDetail();
                    this.close();
                },
                error: () => {
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
