/**
 * @module ModuleSalesDocs
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
import {SalesDocsPDFTabContainerEmail} from "./salesdocspdftabcontaineremail";
import {SalesDocsPDFTabContainerPreview} from "./salesdocspdftabcontainerpreview";

declare var moment: any

/**
 * a component for the tab container to preivew the PDF of a salesdoc
 */
@Component({
    selector: 'salesdocs-pdf-tab-container',
    templateUrl: '../templates/salesdocpdftabcontainer.html',
    animations: [
        trigger('slideInOut', [
            state('open', style({width: '50%'})),
            state('closed', style({width: '100%'})),
            transition('open <=> closed', [
                animate('200ms'),
            ])
        ]),
        trigger('slideInOut2', [
            state('open', style({width: '50%'})),
            state('closed', style({width: '0%'})),
            transition('open <=> closed', [
                animate('200ms'),
            ])
        ]),
    ]
})
export class SalesDocsPDFTabContainer implements OnInit, OnDestroy {


    @ViewChild(SalesDocsPDFTabContainerEmail, {static: false}) public emailContainer: SalesDocsPDFTabContainerEmail;

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

    public salesdocOutput: string = '';
    public salesdocOutputs: any[] = [];

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

    /**
     * initializes modelattachments and retrieves file from backend
     * @param routeParams
     */
    public loadOutput() {
        this.loading = true;
        this.backend.getRequest(`common/spiceattachments/module/SalesDocOutputs/${this.salesdocOutput}/byfield/file`).subscribe({
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
        return this.salesdocOutput ? this.salesdocOutputs.find(o => o.id == this.salesdocOutput).description : '';
    }

    /**
     * loads the outputs for the salesdo
     */
    public getOutputs(forceSetOutput = false) {
        this.loading = true;
        this.backend.getRequest(`module/SalesDocs/${this.model.id}/related/salesdocoutputs?offset=0&limit=99`).subscribe({
            next: (response) => {
                // set loading to false
                this.loading = false;
                // reset the current array
                this.salesdocOutputs = [];
                // sort the response
                for (let id in response) {
                    if (response.hasOwnProperty(id)) {
                        let item = this.model.utils.backendModel2spice('SalesDocOutputs', response[id]);
                        this.salesdocOutputs.push({
                            id: item.id,
                            date_entered: item.date_entered,
                            created_by: item.created_by_user.user_name,
                            description: item.description
                        })
                    }
                }

                // sort the array by date entered
                this.salesdocOutputs.sort((a, b) => a.date_entered.isBefore(b.date_entered) ? 1 : -1);

                // set the default one and laod the output
                if (this.salesdocOutputs.length > 0 && (forceSetOutput || !this.salesdocOutput)) {
                    this.salesdocOutput = this.salesdocOutputs[0].id;
                    this.loadOutput();
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
     * creates a new Output file
     */
    public createNewOutput() {
        let generatorModal = this.modal.await('LBL_GENERATING');
        this.backend.getRequest(`module/SalesDocs/${this.model.id}/output/preview`).subscribe({
            next: (file) => {
                generatorModal.emit(true);
                this.modal.openModal('SalesDocsPDFTabContainerPreview').subscribe({
                    next: (modalRef) => {
                        modalRef.instance.data = atob(file.file);
                        modalRef.instance.name = file.filename;
                        modalRef.instance.type = file.file_mime_type;
                        modalRef.instance.save$.subscribe({
                            next:(save) => {
                                if(save){
                                    this.modal.prompt('input_text', 'MSG_CREATE_NEW_OUTPUT', 'MSG_CREATE_NEW_OUTPUT').subscribe({
                                        next: (text) => {
                                            this.loading = true;
                                            this.backend.postRequest(`module/SalesDocs/${this.model.id}/output`, {}, {
                                                description: text
                                            }).subscribe({
                                                next: (res) => {
                                                    this.loading = false;
                                                    this.getOutputs(true);
                                                },
                                                error: () => {
                                                    this.loading = false;
                                                }
                                            })
                                        }
                                    })
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
     * send the current file to the print spooler
     */
    public printCurrent() {
        this.backend.putRequest(`module/SalesDocOutputs/${this.salesdocOutput}/print`).subscribe({
            next: (res) => {
                if (res.printed) {
                    this.toast.sendToast('LBL_PRINTED', 'success');
                } else {
                    this.toast.sendToast('LBL_PRINT_ERROR', 'error');
                }
            },
            error: (e) => {
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
