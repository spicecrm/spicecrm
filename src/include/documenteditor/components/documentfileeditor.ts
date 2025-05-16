import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    Input,
    OnChanges,
    OnInit, SimpleChanges,
    ViewChild
} from '@angular/core';
import {modelattachments} from "../../../services/modelattachments.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {view} from "../../../services/view.service";
import {DocumentEditor} from "./documenteditor";
import {toast} from "../../../services/toast.service";
import {map, tap} from "rxjs/operators";
import {SafeUrl} from "@angular/platform-browser";
import {helper} from "../../../services/helper.service";
import {modal} from "../../../services/modal.service";
import {Subject} from "rxjs";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: 'document-file-editor',
    templateUrl: '../templates/documentfileeditor.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [modelattachments, view],
    host: {
        'class': 'slds-height_full'
    },
})

export class DocumentFileEditor implements OnInit, OnChanges {
    /**
     * holds the docx file
     */
    public docxFile: { content: any; mimeType: any, dateModified: string};
    /**
     * holds the component config passed from a componentset component renderer
     */
    @Input() public componentconfig: {create_disabled: boolean, field_name: string, with_parsed_pdf: boolean };
    /**
     * is loading flag
     */
    public isLoading: boolean = false;
    /**
     * fullscreen flag
     */
    public isFullscreen: boolean = false;
    /**
     * is editor active flag
     */
    public isEditorActive: boolean = false;
    /**
     * blob url for pdf preview
     */
    public blobUrl: SafeUrl;
    /**
     * blob url for pdf preview
     */
    public fileUploadId: string;
    /**
     * blob url for pdf preview
     */
    @Input() public attachmentId: string;
    /**
     * document editor reference
     * @private
     */
    @ViewChild(DocumentEditor) private editor: DocumentEditor;

    constructor(private modelattachments: modelattachments,
                private cdRef: ChangeDetectorRef,
                private backend: backend,
                private toast: toast,
                public view: view,
                private modal: modal,
                private injector: Injector,
                public helper: helper,
                private configurationService: configurationService,
                public model: model) {
        this.fileUploadId = window._.uniqueId('TxEditorFileUpload_');
        const config = this.configurationService.getCapabilityConfig('txcontrol');
        this.isEditorActive = config?.isActive;
    }

    /**
     * determine if to handle attachment directly or through the md5 field on the bean
     */
    get useDirectAttachment(): boolean {
        return !!this.attachmentId;
    }

    /**
     * is view mode flag
     */
    get isViewMode() {
        return this.fileName + '_pdf_md5' && (!this.isEditable || !this.view.isEditMode());
    }

    /**
     * @return string field name
     */
    get fieldName() {
        return this.componentconfig?.field_name;
    }

    /**
     * @return string file name
     */
    get fileName() {
        return this.model.getField(this.fieldName + '_name');
    }

    /**
     * @return boolean editable flag
     */
    get isEditable(): boolean {
        return (this.model.checkAccess('edit') || this.model.checkAccess('create'));
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.attachmentId && this.attachmentId) {
            this.loadAttachments();
        }
    }

    public ngOnInit() {

        if (this.fieldName && !this.attachmentId) {
            this.loadAttachments();
        }
    }

    /**
     * load attachments
     * @private
     */
    private loadAttachments() {

        const subject = new Subject<void>();

        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;

        this.getFileContent().subscribe({
            next: docFile => {
                this.docxFile = docFile;
                this.cdRef.detectChanges();
                if (this.useDirectAttachment) {
                    subject.next();
                    subject.complete();
                }
            },
            error: () => {
                if (this.useDirectAttachment) {
                    subject.error(false);
                    subject.complete();
                }
            }
        });

        // get the pdf preview from the model field md5. For attachment direct pdf source is unknown
        if (!this.useDirectAttachment) {
            this.getFileContent('_pdf').subscribe({
                next: pdfFile => {
                    const blob = this.helper.b64toBlob(pdfFile.content, 'application/pdf');
                    this.blobUrl = this.helper.dataToBlobUrl(blob);
                    this.cdRef.detectChanges();
                    subject.next();
                    subject.complete();
                },
                error: () => {
                    subject.error(false);
                    subject.complete();
                }
            });
        }

        return subject.asObservable();
    }

    /**
     * downloads the file
     */
    public downloadFile() {
        if (this.useDirectAttachment) {
            this.modelattachments.downloadAttachment(this.attachmentId, this.model.getField('summary_text'));
        } else {
            this.modelattachments.downloadAttachmentForField(this.model.module, this.model.id, this.fieldName, this.model.getField(this.fieldName));
        }
    }

    /**
     * toggle fullscreen
     */
    public toggleFullscreen(): void {
        this.isFullscreen = !this.isFullscreen;
        this.cdRef.detectChanges();
        this.editor.refreshLayout();
    }

    /**
     * set edit mode view/edit
     * @param editMode
     */
    public setEditMode(editMode: boolean) {
        if (editMode && this.isEditorActive) {
            this.view.setEditMode();
        } else if (!editMode) {
            this.view.setViewMode();
        }

        this.cdRef.detectChanges();
    }

    /**
     * save changes
     */
    public save() {

        this.isLoading = true;

        this.editor.getContent('docx').then(file => {

            this.parseAndGeneratePdf(file);

            // for attachment only update is allowed
            let requestFn = () => this.backend.putRequest(`common/spiceattachments/module/${this.model.module}/${this.model.id}/byid/${this.attachmentId}`, null, {file: file.content});

            if (!this.useDirectAttachment) {
                requestFn = () => this.backend.postRequest(`common/spiceattachments/module/${this.model.module}/${this.model.id}/byfield/${this.fieldName}`, null, {
                    file: file.content,
                    file_mime_type: file.mimeType,
                    file_name: this.model.getField('summary_text'),
                });
            }

            requestFn().subscribe(res => {
                this.docxFile = {
                    content: file.content,
                    mimeType: file.mimeType,
                    dateModified: res.date_modified,
                };
            });
        });
    }

    /**
     * parse and generate pdf
     * @param file
     * @private
     */
    private parseAndGeneratePdf(file) {

        const action = this.componentconfig?.with_parsed_pdf ? 'parse' : 'convert';

        this.backend.postRequest(`common/TXControl/${action}/module/${this.model.module}/${this.model.id}`, null, {content: file.content, format: 'PDF'}).subscribe(parseContent => {
            const body = {
                file: parseContent.content,
                file_mime_type: file.mimeType,
                file_name: this.model.getField('summary_text')
            };

            const blob = this.helper.b64toBlob(parseContent.content, 'application/pdf');
            this.blobUrl = this.helper.dataToBlobUrl(blob);

            this.isLoading = false;
            this.setEditMode(false);
            this.toast.sendToast('LBL_DATA_SAVED', 'success');

            // for attachment only preview pdf without save
            if (!this.useDirectAttachment) {
                this.backend.postRequest(`common/spiceattachments/module/${this.model.module}/${this.model.id}/byfield/${this.fieldName + '_pdf'}`, null, body);
            }
        });

    }

    /**
     * edit docx file
     */
    public getFileContent(fieldSuffix: string = '') {

        if (!this.fieldName && !this.useDirectAttachment) return;

        this.isLoading = true;

        let getAttachmentMethod = () => this.modelattachments.getAttachmentDataByField(this.fieldName + fieldSuffix);

        if (this.useDirectAttachment) {
            getAttachmentMethod = () => this.modelattachments.getAttachmentData(this.attachmentId);
        }

        // setEditMode
        return getAttachmentMethod().pipe(
            map(fileData => ({
                content: fileData.file,
                mimeType: fileData.file_mime_type,
                dateModified: fileData.date_modified
            })),
            tap({
                next: () => {
                    this.isLoading = false;
                    this.cdRef.detectChanges();
                },
                error: () => {
                    this.isLoading = false;
                    this.cdRef.detectChanges();
                }
            })
        );
    }

    /**
     * handles the drop event iof a file is dropped onto the file upload field
     * @param files
     * @private
     */
    public onDrop(files) {
        if (files && files.length == 1) {
            this.uploadFiles(files);
        }
    }

    /**
     * the upload itself
     *
     * @param files an array with files
     */
    public uploadFiles(files) {

        this.isLoading = true;
        this.cdRef.detectChanges();

        this.modelattachments.uploadAttachmentsBase64(files).subscribe(() => {
                let file = this.modelattachments.files[0];
                let modelValues: any = {};

                this.model.startEdit(true, true);

                // update the model
                this.model.setFields({
                    [this.fieldName + '_name']: file.filename,
                    [this.fieldName + '_size']: file.filesize,
                    [this.fieldName + '_mime_type']: file.file_mime_type,
                    [this.fieldName + '_md5']: file.filemd5,
                });

                this.model.save();

                this.modelattachments.readFile(files[0]).subscribe(fileContent => {

                    this.isLoading = false;
                    this.cdRef.detectChanges();

                    this.docxFile = {
                        content: fileContent.filecontent,
                        mimeType: fileContent.type,
                        dateModified: fileContent.lastModified,
                    };
                    this.setEditMode(true);
                });
            }
        );
    }

    /**
     * copy from other docx
     */
    public copyFrom() {
        this.modal.openModal('ObjectModalModuleLookup', true, this.injector)
            .subscribe(selectModal => {
                selectModal.instance.module = 'Documents';
                selectModal.instance.multiselect = false;
                selectModal.instance.selectedItems.subscribe(items => {

                    if (!items.length || !items[0][this.fieldName + '_md5']) return;

                    const loading = this.modal.await('LBL_PROCESSING');

                    this.model.startEdit(true, true);
                    this.model.setFields({
                        [this.fieldName + '_md5']: items[0][this.fieldName + '_md5'],
                        [this.fieldName + '_name']: this.model.getField('summary_text'),
                        [this.fieldName + '_mime_type']: items[0][this.fieldName + '_mime_type'],
                        [this.fieldName + '_pdf_md5']: items[0][this.fieldName + '_pdf_md5'],
                        [this.fieldName + '_pdf_name']: this.model.getField('summary_text'),
                        [this.fieldName + '_pdf_mime_type']: items[0][this.fieldName + '_pdf_mime_type'],
                    }, true);

                    this.model.save().subscribe({
                        next: () => {
                            this.loadAttachments().subscribe(() => {
                                loading.next(true);
                                loading.complete();
                                this.setEditMode(true);
                            });
                        },
                        error: () => {
                            loading.next(true);
                            loading.complete();
                        }
                    });
                });
            });
    }
}