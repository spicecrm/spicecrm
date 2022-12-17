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
    templateUrl: "../templates/emailtemplateseditor.html",
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
    public selectedTab: 'editor' | 'preview' = 'editor';
    /**
     * holds the fields names to be used from the component config
     */
    public fieldsNames: {
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
    public activeEditor: 'richText' | 'pageBuilder' | 'html';
    /**
     * holds the iframe height from parent
     * @private
     */
    public iframeHeight: number = 250;
    /**
     * holds the component config load from parent
     */
    public subscription: Subscription = new Subscription();

    constructor(public model: model,
                public cdRef: ChangeDetectorRef,
                public modal: modal,
                public injector: Injector,
                public view: view) {
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
        this.setActiveEditor(this.model.getField('editor_type'));
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
    public setIframeHeight() {
        const height = parseInt(this.componentconfig.previewInitialHeight, 10);
        if (!height || isNaN(height)) return;
        this.iframeHeight = height;
    }

    /**
     * set the body fields name
     * @private
     */
    public setBodyFieldsName() {
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
    public subscribeToModelChanges() {
        this.subscription.add(
            this.model.observeFieldChanges('editor_type').subscribe(value => {
                this.setActiveEditor(value)
            })
        );
        this.subscription.add(
            this.model.data$.subscribe(() => this.cdRef.detectChanges())
        );
        this.subscription.add(
            this.view.mode$.subscribe(() => this.cdRef.detectChanges())
        );
    }

    /**
     * set the active editor
     * @private
     * @param editorType
     */
    public setActiveEditor(editorType: 'richText' | 'pageBuilder' | 'html') {
        this.activeEditor = editorType;
        this.cdRef.detectChanges();
    }

    /**
     * set the selected type
     * @param value
     * @private
     */
    public setSelectedTab(value: 'editor' | 'preview') {
        if (value == 'preview' && !this.model.getField(this.fieldsNames.bodyHtmlField)) return;
        this.selectedTab = value;
    }

    /**
     * open lookup modal to select an email template to be copied to the body
     */
    public copyFromTemplate() {
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

    public updateModelEditor(type) {
        this.setActiveEditor(type);
        this.model.setField('editor_type', type);
    }
}
