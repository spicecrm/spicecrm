/**
 * @module ModuleSpiceAttachments
 */
import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {navigationtab} from "../../../services/navigationtab.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {helper} from "../../../services/helper.service";
import {modal} from "../../../services/modal.service";

/**
 * Display spice attachment in a new tab
 */
@Component({
    selector: 'spice-attachments-container',
    templateUrl: '../templates/spiceattachmentscontainer.html',
    providers: [modelattachments]
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
        public modal: modal) {
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
        this.modelattachments.getAttachmentData(routeParams.attachmentId).subscribe({
            next: (fileData) => {
                this.file = fileData;
                this.type = this.file.file_mime_type.toLowerCase();
                this.blobFile = atob(this.file.file);
                this.setTabTitle();

                // set imgsrc data for image
                if (this.fileType == 'image') {
                    this.imgData = 'data:' + this.file.file_mime_type.toLowerCase() + ';base64,' + this.file.file;
                }
            }, error: () => {
                this.loadingerror = true;
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

}