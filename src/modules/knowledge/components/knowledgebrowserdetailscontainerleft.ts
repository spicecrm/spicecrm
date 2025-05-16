/**
 * @module ModuleKnowledge
 */
import {Component, HostBinding, Input, SimpleChanges, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {KnowledgeService} from "../services/knowledge.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {firstValueFrom} from "rxjs";
import {modelattachments} from "../../../services/modelattachments.service";
import {helper} from "../../../services/helper.service";

@Component({
    selector: "knowledge-browser-details-container-left",
    templateUrl: "../templates/knowledgebrowserdetailscontainerleft.html",
    providers: [modelattachments]
})
export class KnowledgeBrowserDetailsContainerLeft {

    @Input("breadcrumbs") public breadcrumbs: any[] = [];
    @Input() public id: string;
    @HostBinding('style') public height: string = '100%';
    private templates: any[] = [];
    /**
     * blob url for pdf preview
     */
    public blobUrl: SafeUrl;
    /**
     * is loading flag
     */
    public isLoading: boolean = false;

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public sanitizer: DomSanitizer,
                public configuration: configurationService,
                private modelattachments: modelattachments,
                public backend: backend,
                private helper: helper,
                public viewContainerRef: ViewContainerRef,
                public knowledgeService: KnowledgeService) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.id && !!this.id) {
            this.loadPdfContent();
        }
    }

    /**
     * load the pdf content into a blob url
     * @private
     */
    private loadPdfContent() {
        this.isLoading = true;
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
        this.modelattachments.getAttachmentDataByField('file_pdf').subscribe({
            next: fileData => {
                fileData.file;
                const blob = this.helper.b64toBlob(fileData.file, 'application/pdf');
                this.blobUrl = this.helper.dataToBlobUrl(blob);
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    public navigateTo(id) {
        this.knowledgeService.selectedDoc = id;
    }

    /**
     * @deprecated will be replaced with the new document editor print
     * open pdf output modal with the document templates
     */
    public async print() {

        let outputTemplates = this.templates.length > 0 ? this.templates : this.configuration.getData('OutputTemplates');

        if (!outputTemplates || !outputTemplates[this.model.module]) {

            const loadingModal = this.modal.await('LBL_LOADING');

            outputTemplates = await firstValueFrom(this.backend.getRequest('module/OutputTemplates/formodule/' + this.model.module, {})).catch(() => {
                loadingModal.next(false);
                loadingModal.complete();
            });

            this.templates = outputTemplates;

            this.configuration.setData('OutputTemplates', outputTemplates);
            loadingModal.next(true);
            loadingModal.complete();
        }

        if (this.templates.length > 0) {
            // sort the templates
            this.templates.sort((a, b) => a.name > b.name ? 1 : -1);

            // open the modal
            this.modal.openModal('ObjectActionOutputBeanModal', true, this.viewContainerRef.injector).subscribe(outputModal => {
                outputModal.instance.templates = this.templates;
            });
        } else {
            this.modal.info('No Templates Found', 'there are no Output templates defined for the Module');
        }
    }
}
