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
 * @module ModuleEmails
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {Subscription} from "rxjs";
import {toast} from "../../../services/toast.service";

/**
 * renders a preview for the final parsed body html
 */
@Component({
    selector: 'email-templates-preview',
    templateUrl: "./src/modules/emails/templates/emailtemplatespreview.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailTemplatesPreview implements AfterViewInit {
    /**
     * view type radio options
     */
    public viewTypeOptions = [
        {
            title: 'LBL_DESKTOP',
            icon: 'desktop',
            value: 'desktop',
            width: 1024
        },
        {
            title: 'LBL_TABLET',
            icon: 'tablet_portrait',
            value: 'tablet',
            width: 768
        },
        {
            title: 'LBL_MOBILE',
            icon: 'phone_portrait',
            value: 'mobile',
            width: 320
        }
    ];
    /**
     * holds the view type
     */
    private viewType: { title: string, icon: string, value: string, width: number } = {
        title: 'LBL_DESKTOP',
        icon: 'desktop',
        value: 'desktop',
        width: 1024
    };

    /**
     * save the component subscriptions
     */
    private subscription: Subscription = new Subscription();
    /**
     * the selected item
     */
    private selectedItem: { id: string, module: string, text: string };
    /**
     * holds the search field placeholder
     */
    private placeholder: string;
    /**
     * holds the parsed html value
     * @private
     */
    private parsedHtml: SafeResourceUrl;
    /**
     * holds the body html field name from the parent
     * @private
     */
    @Input() private bodyHtmlField: string = 'body_html';
    /**
     * holds the preview for bean module name from parent
     * @private
     */
    @Input() private previewForBean: string;
    /**
     * holds the iframe height from parent
     * @private
     */
    @Input() private iframeHeight: number = 250;

    constructor(private language: language,
                private backend: backend,
                private metadata: metadata,
                private model: model,
                private modal: modal,
                private toast: toast,
                private sanitizer: DomSanitizer,
                private cdRef: ChangeDetectorRef) {
    }

    /**
     * subscribe to model data changes
     */
    public ngAfterViewInit() {
        this.subscribeToModelChanges();
    }

    /**
     * destroy the subscriptions
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * subscribe to model data changes to reset the selected item when the model is changed and to recompile if the html value changed
     * @private
     */
    private subscribeToModelChanges() {
        this.subscription.add(
            this.model.data$.subscribe(() => {
                this.setPlaceholder();
                if (!this.selectedItem || this.selectedItem.module != this.previewForBean) {
                    this.clearSelectedItem();
                }
            })
        );

    }

    /**
     * set the search placeholder
     */
    private setPlaceholder() {
        this.placeholder = !!this.previewForBean ? this.language.getModuleCombinedLabel('LBL_SEARCH', this.previewForBean) : this.language.getLabel('LBL_SEARCH');
        this.cdRef.detectChanges();
    }

    /**
     * opens a model search modal
     */
    private searchWithModal() {
        if (!this.previewForBean) return;
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.previewForBean;
            selectModal.instance.multiselect = false;
            this.subscription.add(
                selectModal.instance.selectedItems.subscribe(items => {
                    if (!items || !items.length) return;
                    this.selectedItem = {
                        id: items[0].id,
                        text: items[0].summary_text,
                        module: this.previewForBean
                    };
                    this.compileBody();
                })
            );
        });
    }

    /**
     * unselect the selected item if the model has changed
     * @private
     */
    private clearSelectedItem() {
        this.selectedItem = undefined;
        this.parsedHtml = undefined;
        this.cdRef.detectChanges();
    }

    /**
     * parse the body by the spice template compiler
     * @private
     */
    private compileBody() {
        if (!this.model.id) return;
        const loadingModal = this.modal.await('LBL_PARSING_HTML');
        const body = {html: this.model.data[this.bodyHtmlField]};
        this.backend.postRequest(`${this.model.module}/liveCompile/${this.previewForBean}/${this.selectedItem.id}`, {}, body)
            .subscribe((data: any) => {
                if (!data || !data.html) {
                    loadingModal.emit(false);
                    return loadingModal.unsubscribe();
                }
                this.parsedHtml = this.sanitizer.bypassSecurityTrustResourceUrl('data:text/html;charset=UTF-8,' + encodeURIComponent(data.html));
                this.cdRef.detectChanges();
                loadingModal.emit(true);
                loadingModal.unsubscribe();
            },
                () => {
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                    loadingModal.emit(false);
                    loadingModal.unsubscribe();
                });
    }

    /**
     * set the view type
     * @param value
     * @private
     */
    private setViewType(value: string) {
        this.viewType = this.viewTypeOptions.find(type => type.value == value);
    }
}
