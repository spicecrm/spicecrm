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


/**
 * renders a tabbed view for email template body
 */
@Component({
    selector: 'email-templates-editor',
    templateUrl: "../templates/emailtemplateseditor.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [view]
})
export class EmailTemplatesEditor implements OnInit, AfterViewInit, OnDestroy {
    /**
     * holds the component config load from parent
     */
    public componentconfig;
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
     * holds expanded side
     */
    public expanded: 'left' | 'right';

    /**
     * holds the component config load from parent
     */
    public subscription: Subscription = new Subscription();
    /**
     * true if the fullscreen enabled
     */
    public isFullscreen: boolean = false;

    /*
     * Hold the characteristic where the module name for bean preview comes from
     * Either directly from the componentconfig or dynamically from a field located in the model.
     */
    public useDynamicModule: boolean = false;

    constructor(public model: model,
                public cdRef: ChangeDetectorRef,
                public modal: modal,
                public injector: Injector,
                public view: view) {
    }

    /**
     * holds the active editor
     */
    get activeEditor(): 'richText' | 'pageBuilder' | 'html' {
        return this.model.data.editor_type;
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
        this.subscribeToModelChanges();
    }

    /**
     * set the body fields name and set the iframe initial height
     */
    public ngOnInit() {
        this.view.isEditable = true;
        this.view.linkedToModel = true;

        this.setUseDynamicModule();
        this.setBodyFieldsName();
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

        if (!this.model.checkAccess('edit') && !this.model.checkAccess('create')) return;

        this.model.startEdit();
        this.view.setEditMode();
        this.cdRef.detectChanges();
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

        if(this.useDynamicModule && this.model.getField(this.componentconfig.previewForBeanField)) {
            this.setActivePreviewForBean(this.model.getField(this.componentconfig.previewForBeanField));
        }
    }

    /**
     * subscribe to model data changes
     * @private
     */
    public subscribeToModelChanges() {

        if(this.useDynamicModule){
            this.subscription.add(
                this.model.observeFieldChanges(this.componentconfig.previewForBeanField).subscribe(value => {
                    this.setActivePreviewForBean(value);
                })
            );
        }

        this.subscription.add(
            this.model.data$.subscribe(() => this.cdRef.detectChanges())
        );
        this.subscription.add(
            this.view.mode$.subscribe(() => this.cdRef.detectChanges())
        );
    }

    /**
     * check the condition to set useDynamicModule
     */
    public setUseDynamicModule() {
        if(!this.componentconfig.previewForBean && this.componentconfig.previewForBeanField){
            this.useDynamicModule = true;
        }
    }

    /**
     * template editor can be used in generic modules where previewForBean
     * will be dynamically set in the parent. MAke sure we retrieve current value from the proper field
     */
    public setPreviewForBean(value) {
        this.fieldsNames.previewForBean = value;
    }

    /**
     * set the active previewForBean
     * @private
     * @param value
     */
    public setActivePreviewForBean(value) {
        this.setPreviewForBean(value);
        this.cdRef.detectChanges();
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
                        [this.fieldsNames.bodySPBField]: items[0].body_spb,
                        editor_type: items[0].editor_type
                    });
                });
            });
    }

    public updateModelEditor(type) {
        this.model.setField('editor_type', type);
        this.cdRef.detectChanges();
    }

    /**
     * set expanded side
     * @param side
     */
    public expand(side: 'left' | 'right') {
        if (!!this.expanded && this.expanded != side) {
            this.expanded = undefined;
        } else this.expanded = side;
    }

    /**
     * toggle the fullscreen mode
     */
    public toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        this.cdRef.detectChanges();
    }
}
