/**
 * @module ModuleSpiceAttachments
 */
import {
    Component, OnInit, Input, NgZone, Output, EventEmitter, ViewChild, ViewContainerRef, Renderer2
} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {modelattachments} from "../../../services/modelattachments.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    selector: 'spice-attachments-popup-list',
    templateUrl: '../templates/spiceattachmentspopuplist.html',
    providers: [modelattachments],
})
export class SpiceAttachmentsPopupList implements OnInit{

    /**
     * @ignore
     *
     * passed in component config
     */
    public componentconfig: any = {};

    /**
     * contructor sets the module and id for the laoder
     * @param modelattachments
     * @param language
     * @param model
     */
    constructor(public modelattachments: modelattachments, public language: language, public model: model) {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }


    /**
     * @ignore
     */
    public ngOnInit() {
        this.modelattachments.getAttachments();
    }

}
