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
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentslist.html',
    providers: [modelattachments],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceAttachmentsList {

    /**
     * @ignore
     *
     * passed in component config
     */
    private componentconfig: any = {};

    /**
     * contructor sets the module and id for the laoder
     * @param modelattachments
     * @param language
     * @param model
     */
    constructor(private modelattachments: modelattachments, private language: language, private model: model, private cdRef: ChangeDetectorRef) {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }


    /**
     * initializes the model attachments service and loads the attachments
     */
    private loadFiles() {
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

}
