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
 * @module ObjectFields
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {Router} from "@angular/router";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'field-page-builder',
    templateUrl: './src/include/spicepagebuilder/templates/fieldpagebuilder.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class fieldPageBuilder extends fieldGeneric implements OnInit, AfterViewInit {
    /**
     * holds the spice page builder html code
     * @private
     */
    private parsedHtml: SafeResourceUrl;
    /**
     * holds the iframe height
     * @private
     */
    private iframeHeight: number = 250;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public backend: backend,
                public toast: toast,
                public router: Router,
                public injector: Injector,
                public modal: modal,
                public cdRef: ChangeDetectorRef,
                public sanitizer: DomSanitizer) {
        super(model, view, language, metadata, router);
    }

    /**
     * set iframe height
     */
    public ngOnInit() {
        super.ngOnInit();
        this.setIframeHeight();
    }

    /**
     * set the html value and subscribe to model data change
     */
    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.setHtmlValue();
        this.modelChangesSubscriber();
    }

    /**
     * sets the edit mode on the view and the model into editmode itself
     */
    public setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
        this.cdRef.detectChanges();
    }

    /**
     * subscribe to model data changes
     * @private
     */
    private modelChangesSubscriber() {
        this.subscriptions.add(
            this.model.data$.subscribe(() =>
                this.setHtmlValue()
            )
        );
        this.subscriptions.add(
            this.view.mode$.subscribe(() =>
                this.cdRef.detectChanges()
            )
        );
    }

    /**
     * set parsed html value
     * @private
     */
    private setHtmlValue() {
        if (!this.value) return;
        this.parsedHtml = this.sanitizer.bypassSecurityTrustResourceUrl('data:text/html;charset=UTF-8,' + encodeURIComponent(this.value));
        this.cdRef.detectChanges();
    }

    /**
     * open page builder modal
     * @private
     */
    private openPageBuilder() {
        const bodySPBFieldName = this.fieldconfig.bodySPBField || 'body_spb';
        this.modal.openModal('SpicePageBuilder', true, this.injector).subscribe(modalRef => {
            if (!!this.value) {
                modalRef.instance.spicePageBuilderService.page = JSON.parse(JSON.stringify(this.model.data[bodySPBFieldName]));
            }
            modalRef.instance.spicePageBuilderService.response.subscribe(res => {
                if (!res) return;
                this.model.setField(bodySPBFieldName, res);
                const loadingModal = this.modal.await('LBL_PARSING_HTML');

                this.backend.postRequest('mjml/parseJsonToHtml', {}, {json: this.model.data[bodySPBFieldName]}).subscribe(res => {
                    if (!res || !res.html) {
                        this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                        loadingModal.emit(true);
                        return loadingModal.complete();
                    }
                    this.parsedHtml = this.sanitizer.bypassSecurityTrustResourceUrl('data:text/html;charset=UTF-8,' + encodeURIComponent(res.html));
                    this.value = res.html;
                    loadingModal.emit(true);
                    loadingModal.complete();
                });
                modalRef.instance.self.destroy();
            });
        });
    }

    /**
     * set the iframe initial height
     * @private
     */
    private setIframeHeight() {
        const height = parseInt(this.fieldconfig.initialHeight, 10);
        if (!height || isNaN(height)) return;
        this.iframeHeight = height;
    }
}
