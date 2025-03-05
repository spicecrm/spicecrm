import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {modelattachments} from "../../../services/modelattachments.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {view} from "../../../services/view.service";
import {DocumentEditor} from "./documenteditor";
import {toast} from "../../../services/toast.service";
import {map, tap} from "rxjs/operators";
import {SafeUrl} from "@angular/platform-browser";
import {helper} from "../../../services/helper.service";

@Component({
    selector: 'document-file-editor',
    templateUrl: '../templates/documentfileeditor.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [modelattachments, view],
    host: {
        'class': 'slds-height_full'
    },
})

export class DocumentFileEditor implements OnInit {
    /**
     * holds the docx file
     */
    public docxFile: { content: any; mimeType: any, dateModified: string};
    /**
     * holds the component config passed from a componentset component renderer
     */
    public componentconfig: { field_name: string };
    /**
     * is loading flag
     */
    public isLoading: boolean = false;
    /**
     * fullscreen flag
     */
    public isFullscreen: boolean = false;
    /**
     * blob url for pdf preview
     */
    public blobUrl: SafeUrl;
    /**
     * blob url for pdf preview
     */
    public fileUploadId: string;
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
                public helper: helper,
                public model: model) {
        this.fileUploadId = window._.uniqueId('TxEditorFileUpload_');
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

    public ngOnInit() {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
        this.getFileContent().subscribe(docFile => this.docxFile = docFile);
        this.getFileContent('_pdf').subscribe(pdfFile => {
            const blob = this.helper.b64toBlob(pdfFile.content, 'application/pdf');
            this.blobUrl = this.helper.dataToBlobUrl(blob);
            this.cdRef.detectChanges();
        });
    }

    /**
     * downloads the file
     */
    public downloadFile() {
        this.modelattachments.downloadAttachmentForField(this.model.module, this.model.id, this.fieldName, this.model.getField(this.fieldName));
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
        if (editMode) {
            this.view.setEditMode();
        } else {
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

            const body = {
                file: file.content,
                file_mime_type: file.mimeType,
                file_name: this.model.getField('summary_text')
            };

            this.backend.postRequest(`common/spiceattachments/module/${this.model.module}/${this.model.id}/byfield/${this.fieldName}`, null, body).subscribe(res => {

                this.docxFile = {
                    content: file.content,
                    mimeType: file.mimeType,
                    dateModified: res.date_modified,
                };

                this.isLoading = false;
                this.setEditMode(false);
                this.toast.sendToast('LBL_DATA_SAVED', 'success');
            });
        });

        this.editor.getContent('pdf').then(file => {

            const body = {
                file: file.content,
                file_mime_type: file.mimeType,
                file_name: this.model.getField('summary_text')
            };

            const blob = this.helper.b64toBlob(file.content, 'application/pdf');
            this.blobUrl = this.helper.dataToBlobUrl(blob);

            this.backend.postRequest(`common/spiceattachments/module/${this.model.module}/${this.model.id}/byfield/${this.fieldName + '_pdf'}`, null, body);
        });
    }

    /**
     * edit docx file
     */
    public getFileContent(fieldSuffix: string = '') {

        if (!this.fieldName) return;

        this.isLoading = true;

        // setEditMode
        return this.modelattachments.getAttachmentDataByField(this.fieldName + fieldSuffix).pipe(
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
                // somewhat ugly logic to get the prefix from the field .. it has to end with name
                modelValues[this.fieldName + '_name'] = file.filename;
                modelValues[this.fieldName + '_size'] = file.filesize;
                modelValues[this.fieldName + '_mime_type'] = file.file_mime_type;
                modelValues[this.fieldName + '_md5'] = file.filemd5;

                // update the model
                this.model.setFields(modelValues);
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
}