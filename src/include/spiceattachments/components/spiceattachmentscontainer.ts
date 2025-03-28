/**
 * @module ModuleSpiceAttachments
 */
import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {navigationtab} from "../../../services/navigationtab.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {helper} from "../../../services/helper.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {Router} from "@angular/router";
import {configurationService} from "../../../services/configuration.service";

/**
 * Display spice attachment in a new tab
 */
@Component({
    selector: 'spice-attachments-container',
    templateUrl: '../templates/spiceattachmentscontainer.html',
    providers: [modelattachments, model]
})

export class SpiceAttachmentsContainer implements OnDestroy {

    /**
     * holds module related to attachment
     */
    public module: string = '';

    /**
     * holds module id
     */
    public id: string = '';

    /**
     * if we get a loading error
     */
    public loadingerror: boolean = false;

    /**
     * loading flag
     */
    public isLoading: boolean = false;

    /**
     * route params
     */
    public routeParams: {fieldname: string; attachmentId: string};
    /**
     * is editor active flag
     */
    public isEditorActive: boolean = false;
    /**

    /**
     * subscribe to route component
     */
    public componentSubscriptions: Subscription = new Subscription();

    /**
     * holds file object
     */
    public file: any = {};

    /**
     * holds translated blob file value
     */
    public blobFile: string = '';

    /**
     * holds file type
     */
    public type: string;

    /**
     * holds image data
     */
    public imgData: string;

    constructor(
        public navigationtab: navigationtab,
        public modelattachments: modelattachments,
        public helper: helper,
        private backend: backend,
        private router: Router,
        private configurationService: configurationService,
        public model: model,
        public modal: modal) {

        const config = this.configurationService.getCapabilityConfig('txcontrol');
        this.isEditorActive = config?.isActive;

        this.componentSubscriptions.add(
            this.navigationtab.activeRoute$.subscribe(route => {
                this.initialize(route.params);
            })
        );
    }

    /**
     * translates the file type
     */
    get fileType() {
        if (!this.type) return '';

        let typeArray = this.type.split("/");
        switch (typeArray[0]) {
            case 'image':
                return typeArray[0];
            default:
                return 'notImage';
        }
    }

    /**
     * unsubscribe & revoke blob url from session cache
     */
    public ngOnDestroy() {
        URL.revokeObjectURL(this.helper.blobUrl);
        this.componentSubscriptions.unsubscribe();
        this.navigationtab.closeTab();
    }

    /**
     * initializes modelattachments and retrieves file from backend
     * @param routeParams
     */
    public initialize(routeParams) {
        this.modelattachments.module = routeParams.module;
        this.modelattachments.id = routeParams.id;
        this.model.id = routeParams.id;
        this.model.module = routeParams.module;
        this.model.getData();
        this.isLoading = true;
        this.routeParams = routeParams;

        if(routeParams.fieldname){
            this.modelattachments.getAttachmentDataByField(routeParams.fieldname).subscribe({
                next: (fileData) => {

                    this.file = fileData;

                    // generate pdf preview of the docx file
                    if (fileData.file_mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {

                        this.handleDocXPreview(routeParams, this.file.file);

                    } else {

                        this.isLoading = false;

                        this.type = this.file.file_mime_type.toLowerCase();

                        this.blobFile = atob(this.file.file);
                        this.setTabTitle();

                        // set imgsrc data for image
                        if (this.fileType == 'image') {
                            this.imgData = 'data:' + this.file.file_mime_type.toLowerCase() + ';base64,' + this.file.file;
                        }
                    }

                }, error: () => {
                    this.isLoading = false;
                    this.loadingerror = true;
                }
            });
        } else {
            this.modelattachments.getAttachmentData(routeParams.attachmentId).subscribe({
                next: (fileData) => {
                    this.file = fileData;

                    // generate pdf preview of the docx file
                    if (fileData.file_mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {

                        this.handleDocXPreview(routeParams, this.file.file);

                    } else {

                        this.isLoading = false;

                        this.type = this.file.file_mime_type.toLowerCase();
                        this.blobFile = atob(this.file.file);
                        this.setTabTitle();

                        // set imgsrc data for image
                        if (this.fileType == 'image') {
                            this.imgData = 'data:' + this.file.file_mime_type.toLowerCase() + ';base64,' + this.file.file;
                        }
                    }
                }, error: () => {
                    this.isLoading = false;
                    this.loadingerror = true;
                }
            });
        }
    }

    /**
     * parse the docx file to pdf and show it
     * @param routeParams
     * @param content
     * @private
     */
    private handleDocXPreview(routeParams, content) {
        this.backend.postRequest(`common/TXControl/parse/module/${routeParams.module}/${routeParams.id}`, null, {content: content, format: 'PDF'}).subscribe({
            next: parseContent => {
                this.isLoading = false;
                this.file.file = parseContent.content;
                this.type = 'application/pdf';
                this.blobFile = atob(this.file.file);
                this.setTabTitle();
            },
            error: () => {
                this.isLoading = false;
                this.type = this.file.file_mime_type;
                this.blobFile = atob(this.file.file);
                this.setTabTitle();
            }
        });

    }

    /**
     * displays header info in the tab
     */
    public setTabTitle() {
        const tabInfoObj = {
            displayname: this.file.filename,
            displayicon: 'attach',
        }
        this.navigationtab.setTabInfo(tabInfoObj)
    }

    /**
     * set docx editing to true
     */
    public editDocX() {

        const routePrefix = !this.navigationtab?.tabid ? '' : ('/tab/' + this.navigationtab.tabid);
        this.navigationtab.closeTab();

        if (this.routeParams.attachmentId) {
            this.router.navigate([`${routePrefix}/docx/edit/${this.routeParams.attachmentId}/${this.modelattachments.module}/${this.modelattachments.id}`]);
        } else {
            this.router.navigate([`${routePrefix}/docx/edit/${this.model.module}/${this.model.id}/fieldname/${this.routeParams.fieldname}`]);
        }
    }
}