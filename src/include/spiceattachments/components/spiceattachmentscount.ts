/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    constructor(private metadata: metadata, private modelattachments: modelattachments, @Optional() @SkipSelf() private parentmodelattachments: modelattachments, private language: language, private model: model, private cdRef: ChangeDetectorRef) {
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

    private modelHasAttachmentcount() {
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
