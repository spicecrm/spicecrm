/*
SpiceUI 2018.10.001

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
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    OnDestroy,
    OnInit
} from "@angular/core";
import {model} from "../../../services/model.service";
import {Subscription} from "rxjs";
import {view} from "../../../services/view.service";
import {modal} from "../../../services/modal.service";

/** @ignore */
declare var _;

/**
 * renders a tabbed view for email template body
 */
@Component({
    selector: 'email-templates-editor',
    templateUrl: "./src/modules/emails/templates/emailtemplateseditor.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailTemplatesEditor implements OnInit, AfterViewInit, OnDestroy {
    /**
     * holds the component config load from parent
     */
    public componentconfig;
    /**
     * the currently selected tab
     */
    private selectedTab: 'editor' | 'preview' = 'editor';
    /**
     * holds the fields names to be used from the component config
     */
    private fieldsNames: {
        /** holds the body html field name */
        bodyHtmlField?: string,
        /** holds the body spice page builder field name */
        bodySPBField?: string,
        /** holds the subject field name */
        subjectField?: string,
        /** holds the mailbox field name */
        mailboxField?: string,
        /** holds the preview for bean module name */
        previewForBean?: string

    } = {bodyHtmlField: 'body_html', bodySPBField: 'body_spb'};
    /**
     * holds the active editor
     */
    private activeEditor: 'richText' | 'pageBuilder';
    /**
     * holds the iframe height from parent
     * @private
     */
    private iframeHeight: number = 250;
    /**
     * holds the component config load from parent
     */
    private subscription: Subscription = new Subscription();

    constructor(private model: model,
                private cdRef: ChangeDetectorRef,
                private modal: modal,
                private injector: Injector,
                private view: view) {
    }

    /**
     * @return matchedModelState: boolean
     */
    get isHidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }

    /**
     * set active editor and subscribe to model data changes
     */
    public ngAfterViewInit() {
        this.setActiveEditor(this.model.data[this.fieldsNames.bodyHtmlField], this.model.data[this.fieldsNames.bodySPBField]);
        this.subscribeToModelChanges();
    }

    /**
     * set the body fields name and set the iframe initial height
     */
    public ngOnInit() {
        this.setBodyFieldsName();
        this.setIframeHeight();
    }

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
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
     * set the iframe initial height
     * @private
     */
    private setIframeHeight() {
        const height = parseInt(this.componentconfig.previewInitialHeight, 10);
        if (!height || isNaN(height)) return;
        this.iframeHeight = height;
    }

    /**
     * set the body fields name
     * @private
     */
    private setBodyFieldsName() {
        if (!!this.componentconfig.bodyHtmlField) this.fieldsNames.bodyHtmlField = this.componentconfig.bodyHtmlField;
        if (!!this.componentconfig.bodySPBField) this.fieldsNames.bodySPBField = this.componentconfig.bodySPBField;
        if (!!this.componentconfig.subjectField) this.fieldsNames.subjectField = this.componentconfig.subjectField;
        if (!!this.componentconfig.mailboxField) this.fieldsNames.mailboxField = this.componentconfig.mailboxField;
        if (!!this.componentconfig.previewForBean) this.fieldsNames.previewForBean = this.componentconfig.previewForBean;
    }

    /**
     * subscribe to model data changes
     * @private
     */
    private subscribeToModelChanges() {
        this.subscription.add(
            this.model.data$.subscribe(data =>
                this.setActiveEditor(data[this.fieldsNames.bodyHtmlField], data[this.fieldsNames.bodySPBField])
            )
        );
        this.subscription.add(
            this.view.mode$.subscribe(() => this.cdRef.detectChanges()));
    }

    /**
     * set the active editor
     * @param body
     * @param bodySPB
     * @private
     */
    private setActiveEditor(body: string, bodySPB: string) {
        this.activeEditor = !body ? undefined : (!bodySPB || _.isEmpty(bodySPB)) ? 'richText' : 'pageBuilder';
        this.model.data.via_spb = this.activeEditor == 'pageBuilder';
        this.cdRef.detectChanges();
    }

    /**
     * set the selected type
     * @param value
     * @private
     */
    private setSelectedTab(value: 'editor' | 'preview') {
        if (value == 'preview' && !this.model.data[this.fieldsNames.bodyHtmlField]) return;
        this.selectedTab = value;
    }

    /**
     * open lookup modal to select an email template to be copied to the body
     */
    private copyFromTemplate() {
        this.modal.openModal('ObjectModalModuleLookup', true, this.injector)
            .subscribe(selectModal => {
                selectModal.instance.module = 'EmailTemplates';
                selectModal.instance.multiselect = false;
                selectModal.instance.selectedItems.subscribe(items => {
                    if (!items.length) return;
                    this.model.setFields({
                        [this.fieldsNames.bodyHtmlField]: items[0].body_html,
                        [this.fieldsNames.bodySPBField]: items[0].body_spb
                    });
                });
            });
    }
}
