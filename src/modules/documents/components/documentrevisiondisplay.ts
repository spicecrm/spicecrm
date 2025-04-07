/**
 * @module ModuleDocuments
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../../services/model.service';
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'document-revision-display',
    templateUrl: '../templates/documentrevisiondisplay.html'

})
export class DocumentRevisionDisplay implements OnInit{

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * subscriptions for the field
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * to indicate we are loading
     */
    public loading: boolean = false;

    /**
     * holds file object
     */
    public file: any = {};

    constructor(
        public model: model,
        public backend: backend,
        public sanitizer: DomSanitizer,
        public viewContainerRef: ViewContainerRef
    ) {

    }

    public ngOnInit() {
        if(this.componentconfig.fieldname) {
            this.subscriptions.add(this.model.data$.subscribe({
                next: (data) => {
                    if (!!this.model.getField(this.componentconfig.fieldname + '_md5')) {
                        this.getAttachment();
                    } else {
                        this.file = {};
                    }
                }
            }));
        }
    }

    get mimeType(){
        if(this.componentconfig.fieldname){
            return this.model.getField(this.componentconfig.fieldname + '_mime_type');
        }

        return undefined;
    }

    get fileData(){
        return atob(this.file.file);
    }

    /**
     * a specific method to retrieve the attachment for a bean
     * also handles legacy methods where the file is stored with the bean id and not the MD5 in the backend
     */
    public getAttachment() {
        this.loading = true;

        let url = `common/spiceattachments/module/${this.model.module}/${this.model.id}/byfield/${this.componentconfig.fieldname}`;

        // somewhat ugly logic to get the prefix from the field .. it has to end with name
        this.backend.getRequest(url).subscribe({
            next: (fileData) => {
                this.file = fileData;
                if (this.model.isEditing) {
                    this.file.filename = this.model.getField(this.componentconfig.fieldname + '_name');
                    this.file.file_mime_type = this.model.getField(this.componentconfig.fieldname + '_mime_type');
                    this.file.filesize = this.model.getField(this.componentconfig.fieldname + '_size');
                }
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
            }
        });
    }

}
