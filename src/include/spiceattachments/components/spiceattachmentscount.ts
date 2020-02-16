/**
 * @module ModuleSpiceAttachments
 */
import {ChangeDetectionStrategy, Component, ChangeDetectorRef, Optional, SkipSelf, OnDestroy} from '@angular/core';
import {model} from "../../../services/model.service";
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
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentscount.html',
    providers: [modelattachments],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceAttachmentsCount implements OnDestroy {

    private subscriptions: Subscription = new Subscription();

    /**
     * contructor sets the module and id for the laoder
     * @param modelattachments
     * @param parentmodelattachments
     * @param language
     * @param model
     */
    constructor(private modelattachments: modelattachments, @Optional() @SkipSelf() private parentmodelattachments: modelattachments, private language: language, private model: model, private cdRef: ChangeDetectorRef) {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
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
        return this.parentmodelattachments ? this.parentmodelattachments.count : this.modelattachments.count;
    }
}
