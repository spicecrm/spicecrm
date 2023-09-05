/**
 * @module ModuleSpiceAttachments
 */
import {ChangeDetectionStrategy, Component, ChangeDetectorRef} from '@angular/core';
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modelattachments} from "../../../services/modelattachments.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    selector: 'spice-attachments-list',
    templateUrl: '../templates/spiceattachmentslist.html',
    providers: [modelattachments],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceAttachmentsList {

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
    constructor(public modelattachments: modelattachments, public language: language, public model: model, public cdRef: ChangeDetectorRef) {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }


    /**
     * initializes the model attachments service and loads the attachments
     */
    public loadFiles() {
        this.modelattachments.getAttachments().subscribe(files => {
            this.cdRef.detectChanges();
        });
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        setTimeout(() => this.loadFiles(), 10);
    }

    /**
     * Component style according to the component config property "horizontal".
     */
    public getCompStyle() {
        return {
            marginRight: this.componentconfig.horizontal ? '-16px' : undefined,
            marginBottom: this.componentconfig.horizontal ? '-8px' : undefined,
        }
    }

    /**
     * Item classes according to the component config property "horizontal".
     */
    public getItemClass() {
        return this.componentconfig.horizontal ? 'slds-m-right_medium slds-m-bottom_x-small':'slds-size--1-of-1';
    }

}
