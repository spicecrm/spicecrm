/**
 * @module ModuleSpiceAttachments
 */
import {
    Component, Injector, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {helper} from "../../../services/helper.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Observable, Subject} from "rxjs";


/**
 * renders a field to upload files in a model itself
 */
@Component({
    selector: 'field-model-attachment-preview',
    templateUrl: '../templates/fieldmodelattachmentpreview.html',
    providers: [modelattachments]
})
export class fieldModelAttachmentPreview extends fieldGeneric implements OnInit{

    /**
     * holds file object
     */
    public file: any = {};


    /**
     * a loading indicator
     */
    public loading: boolean = false;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public injector: Injector,
        public modelattachments: modelattachments,
        public modal: modal,
        public helper: helper,
        public backend: backend
    ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.subscriptions.add(this.model.data$.subscribe({
            next: (data) => {
                if(!!this.filename){
                    this.getAttachment();
                } else {
                    this.file = {};
                }
            }
        }));
    }

    get filename(){
        return this.model.getField(this.fieldname + '_name');
    }

    get fileType() {
        if (!this.mimeType) return '';

        let typeArray = this.mimeType.split("/");
        switch (typeArray[0]) {
            case 'image':
                return typeArray[0];
            default:
                return 'notImage';
        }
    }

    get prefix() {
        // legacy handling supporting the module where the fieldname is still filename
        // and it is one file
        if (this.fieldname == 'filename') {
            return 'file';
        }

        // parse the prefix out of the filename
        return this.fieldname.substring(0, this.fieldname.length - 5);
    }

    get mimeType(){
        return this.file.file_mime_type?.toLowerCase();
    }

    get fileData(){
        return atob(this.file.file);
    }

    get imgData(){
        return 'data:' + this.file.file_mime_type.toLowerCase() + ';base64,' + this.file.file;
    }

    get filemd5(){
        return this.model.getField(this.fieldname + '_md5');
    }

    /**
     * a specific kethod to retrieve the attachment for a bean
     * also handles legacy methods where the file is stored with the bean id and not the MD5 in the backend
     */
    public getAttachment() {
        this.loading = true;

        let url = `common/spiceattachments/module/${this.model.module}/${this.model.id}/byfield/${this.fieldname}`;
        if(this.model.isEditing) url += `/${this.filemd5}`

        // somewhat ugly logic to get the prefix from the field .. it has to end with name
        this.backend.getRequest(url).subscribe({
            next: (fileData) => {
                this.file = fileData;
                if(this.model.isEditing){
                    this.file.filename = this.model.getField(this.fieldname + '_name');
                    this.file.file_mime_type = this.model.getField(this.fieldname + '_mime_type');
                    this.file.filesize = this.model.getField(this.fieldname + '_size');
                }
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
            }
        });

    }


}
