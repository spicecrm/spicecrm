/**
 * @module ModuleOutputTemplates
 */
import {
    Component, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";
import {helper} from "../../../services/helper.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {OutputRevisionsPDFTabContainerEmail} from "./outputrevisionspdftabcontaineremail";


declare var moment: any

/**
 * a component for the tab container to preivew the PDF of a salesdoc
 */
@Component({
    selector: 'outputrevisions-pdf-tab-container',
    templateUrl: '../templates/outputrevisionspdftabcontainer.html',
    animations: [
        trigger('slideInOut', [
            state('open', style({ width: '50%' })),
            state('closed', style({ width: '100%' })),
            transition('open <=> closed', [
                animate('200ms'),
            ])
        ]),
        trigger('slideInOut2', [
            state('open', style({ width: '50%' })),
            state('closed', style({ width: '0%' })),
            transition('open <=> closed', [
                animate('200ms'),
            ])
        ]),
    ],
    standalone: false
})
export class OutputRevisionsPDFTabContainer implements OnInit, OnDestroy {


    @ViewChild(OutputRevisionsPDFTabContainerEmail, {static: false}) public emailContainer: OutputRevisionsPDFTabContainerEmail;

    /**
     * holds file object
     */
    public file: any = {};

    /**
     * holds translated blob file value
     */
    public blobFile: string = '';

    /**
     * indicator that we are loading
     */
    public loading: boolean = false;

    /**
     * an array with the templates we have
     */
    public outputTemplates: {id:string, name:string}[] = [];

    /**
     * the selected template
     */
    public outputTemplate: string;

    public outputRevision: string = '';
    public outputRevisions: any[] = [];

    private subscriptions: Subscription = new Subscription();

    public showEmail: boolean = false;

    constructor(
        public model: model,
        public backend: backend,
        public helper: helper,
        public modal: modal,
        public toast: toast,
        public language: language
    ) {

    }

    public ngOnInit() {
        this.getOutputs();

        this.subscriptions.add(
            this.model.saved$.subscribe({
                next: () => {
                    this.getOutputs();
                }
            })
        )
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    get outputtemplate(){
        return this.outputTemplate;
    }

    set outputtemplate(outputTemplate){
        this.outputTemplate = outputTemplate;
        this.outputRevision = this.outputrevisions[0].id;
        this.loadOutput();
    }

    get outputrevisions(){
        return this.outputRevisions.filter(or => or.outputtemplate_id == this.outputTemplate);
    }

    /**
     * initializes modelattachments and retrieves file from backend
     * @param routeParams
     */
    public loadOutput() {
        this.loading = true;
        this.backend.getRequest(`common/spiceattachments/module/OutputRevisions/${this.outputRevision}/byfield/file`).subscribe({
            next: (fileData) => {
                this.file = fileData;
                this.blobFile = atob(this.file.file);
                this.loading = false;
            },
            error: (e) => {
                this.loading = false;
            }
        })
    }

    /**
     * returns the description of the current seleted Output
     *
     * @constructor
     */
    get outputDescription() {
        return this.outputRevision ? this.outputRevisions.find(o => o.id == this.outputRevision).description : '';
    }

    /**
     * loads the outputs for the salesdo
     */
    public getOutputs(forceSetOutput = false, outputrevision_id?: string) {
        this.loading = true;
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/related/outputrevisions?offset=0&limit=99`).subscribe({
            next: (response) => {
                // set loading to false
                this.loading = false;
                // reset the current array
                this.outputRevisions = [];
                // sort the response
                for (let resItem of response) {
                    let item = this.model.utils.backendModel2spice('OutputRevisions', resItem);
                    this.outputRevisions.push({
                        id: item.id,
                        outputtemplate_id: item.outputtemplate_id,
                        outputtemplate_name: item.outputtemplate_name,
                        date_entered: item.date_entered,
                        created_by: item.created_by_user.user_name,
                        description: item.description
                    })

                    // add the template id
                    if(!this.outputTemplates.find(o => o.id == resItem.outputtemplate_id)){
                        this.outputTemplates.push({
                            id: resItem.outputtemplate_id,
                            name: resItem.outputtemplate_name
                        })
                    }
                }

                // sort the templates found
                this.outputTemplates.sort((a, b) => a.name.localeCompare(b.name));

                // sort the array by date entered
                this.outputRevisions.sort((a, b) => a.date_entered.isBefore(b.date_entered) ? 1 : -1);

                if(outputrevision_id){
                    let or = this.outputRevisions.find(or => or.id == outputrevision_id);
                    this.outputTemplate = or.outputtemplate_id;
                    this.outputRevision = outputrevision_id;
                    this.loadOutput();
                } else {
                    // set the default template
                    if (this.outputTemplates.length > 0) {
                        this.outputTemplate = this.outputTemplates[0].id;
                    }

                    // set the default one and laod the output
                    if (this.outputRevisions.length > 0 && (forceSetOutput || !this.outputRevision)) {
                        this.outputRevision = this.outputRevisions.filter(or => or.outputtemplate_id == this.outputTemplate)[0].id;
                        this.loadOutput();
                    }
                }
            },
            error: (e) => {
                this.loading = false;
            }
        })
    }

    /**
     * actiuon to download the current file
     */
    public downloadOutput() {
        if (this.file.file) {
            let blob = this.helper.b64toBlob(this.file.file, "application/pdf");
            let blobUrl = URL.createObjectURL(blob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = blobUrl;
            a.download = this.file.filename;
            a.type = "application/pdf";
            a.click();
            a.remove();
        }
    }


    /**
     * create a new output
     */
    public createNewOutput() {
        let loadTemplatesModal = this.modal.await('LBL_LOADING_TEMPLATES');
        // module/OutputTemplates/formodule/{module}/{id}

        this.backend.getRequest(`module/OutputTemplates/formodule/${this.model.module}/${this.model.id}`).subscribe({
            next: (templates) => {
                loadTemplatesModal.emit(true);
                if(templates.length > 0){
                    if(templates.length > 1){
                        let defaultTemplate = templates.find(t => t.default == 1);
                        this.modal.prompt('input', null, 'LBL_SELECT_TEMPLATE', 'shade', defaultTemplate ? defaultTemplate.id : null, templates.map(t => { return {value: t.id, display: t.name}}), 'radio').subscribe({
                            next: (templateId) => {
                                if(templateId) this.generateOutput(templateId);
                            }
                        })
                    } else {
                        this.generateOutput(templates[0].id);
                    }
                } else {
                    this.toast.sendToast('MSG_NO_TEMPLATES_FOUNSD', 'warning');
                }
            },
            error: (e) => {
                loadTemplatesModal.emit(true);
                this.toast.sendToast('LBL_NO_TEMPLATE_FOUND', 'warning');
            }
        })
    }

    /**
     * creates a new Output file
     */
    public generateOutput(template) {
        let generatorModal = this.modal.await('LBL_GENERATING');
        this.backend.getRequest(`module/OutputRevisions/${this.model.module}/${this.model.id}/output/${template}/preview`).subscribe({
            next: (file) => {
                generatorModal.emit(true);
                this.modal.openModal('OutputRevisionsPDFTabContainerPreview').subscribe({
                    next: (modalRef) => {
                        modalRef.instance.data = atob(file.file);
                        modalRef.instance.name = file.filename;
                        modalRef.instance.type = file.file_mime_type;
                        modalRef.instance.save$.subscribe({
                            next:(save) => {
                                if(save){
                                    // if we have other than the initial printout prompt a text
                                    if(this.outputRevisions.filter(or => or.outputtemplate_id == template).length > 0) {
                                        this.modal.prompt('input_text', 'MSG_CREATE_NEW_OUTPUT', 'MSG_CREATE_NEW_OUTPUT').subscribe({
                                            next: (text) => {
                                                this.postOutput(template, text)
                                            }
                                        })
                                    } else {
                                        this.postOutput(template)
                                    }
                                }
                            }
                        })
                    }
                })
            },
            error: () => {
                generatorModal.emit(true);
            }
        })
    }

    /**
     * post the output
     * @param template
     * @param text
     * @private
     */
    private postOutput(template, text = undefined) {
        this.loading = true;
        this.backend.postRequest(`module/OutputRevisions/${this.model.module}/${this.model.id}/output/${template}`, {}, {
            description: text
        }).subscribe({
            next: (res) => {
                this.loading = false;
                this.getOutputs(true, res.id);
            },
            error: () => {
                this.loading = false;
            }
        })
    }

    /**
     * send the current file to the print spooler
     */
    public printCurrent() {
        let printModal = this.modal.await('LBL_PRINTING');
        this.backend.putRequest(`module/OutputRevisions/${this.outputRevision}/print`).subscribe({
            next: (res) => {
                printModal.emit(true);
                if (res.printed) {
                    this.toast.sendToast('LBL_PRINTED', 'success');
                } else {
                    this.toast.sendToast('LBL_PRINT_ERROR', 'error');
                }
            },
            error: (e) => {
                printModal.emit(true);
                this.toast.sendToast('LBL_PRINT_ERROR', 'error', e.error.error);
            }
        })
    }

    get filelist() {
        return [{
            size: this.file.filesize,
            name: this.file.filename,
            type: this.file.file_mime_type,
            filecontent: this.file.file
        }];
    }

    /**
     * returns if we have an email content and that is not disabled
     */
    get canSend(){
        return this.emailContainer && !this.emailContainer.disabled;
    }

    public cancelSend(){
        if(this.emailContainer && !this.emailContainer.isDirty) {
            this.modal.prompt('confirm', 'MSG_CANCEL_SEND_EMAIL', 'MSG_CANCEL_SEND_EMAIL').subscribe({
                next: (res) => {
                    if (res) this.showEmail = false;
                }
            })
        } else {
            this.showEmail = false;
        }
    }

    /**
     * triggers the send email for the container
     */
    public sendEmail(){
        this.emailContainer.sendEmail().subscribe({
            next: () => {
                this.showEmail = false;
            }
        });
    }
}
