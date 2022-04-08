/**
 * @module ModuleSpiceAttachments
 */
import {ChangeDetectionStrategy, Component, ChangeDetectorRef, Optional, SkipSelf, OnDestroy} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    selector: 'spice-attachments-count',
    templateUrl: '../templates/spiceattachmentscount.html',
    providers: [modelattachments],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceAttachmentsCount implements OnDestroy {

    public subscriptions: Subscription = new Subscription();

    /**
     * contructor sets the module and id for the laoder
     * @param modelattachments
     * @param parentmodelattachments
     * @param language
     * @param model
     */
    constructor(public metadata: metadata, public modelattachments: modelattachments, @Optional() @SkipSelf() public parentmodelattachments: modelattachments, public language: language, public model: model, public cdRef: ChangeDetectorRef) {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        if(!this.modelHasAttachmentcount()) {
            if (this.parentmodelattachments) {
                this.subscriptions.add(this.parentmodelattachments.getCount().subscribe(count => {
                    this.cdRef.detectChanges();
                }));
            } else {
                this.subscriptions.add(this.modelattachments.getCount().subscribe(count => {
                    this.cdRef.detectChanges();
                }));
            }
        }
    }

    public modelHasAttachmentcount() {
        let fields = this.metadata.getModuleFields(this.model.module);
        return !!fields.attachments_count;
    }

    /**
     * destroy any subscription that might still be active
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns the count
     */
    get count() {
        // if the model has an attachment count .. return the value
        if(this.modelHasAttachmentcount()) return this.model.getField('attachments_count');

        // otherwise get the atachment model count
        return this.parentmodelattachments ? this.parentmodelattachments.count : this.modelattachments.count;
    }
}
