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
    selector: 'spice-attachments-count',
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentscount.html',
    providers: [modelattachments],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceAttachmentsCount {

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
     * @ignore
     */
    public ngAfterViewInit() {
        this.modelattachments.getCount().subscribe(count => {
            this.cdRef.detectChanges();
        });
    }

    /**
     * returns the count
     */
    get count() {
        return this.modelattachments.count;
    }
}
