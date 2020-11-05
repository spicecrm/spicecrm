/**
 * @module ModuleEmails
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit
} from "@angular/core";
import {model} from "../../../services/model.service";
import {Subscription} from "rxjs";
import {view} from "../../../services/view.service";

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
     * holds the body html field name
     */
    private bodyHtmlField: string = 'body_html';
    /**
     * holds the body spice page builder field name
     */
    private bodySPBField: string = 'body_spb';
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

    constructor(private model: model, private cdRef: ChangeDetectorRef, private view: view) {
    }

    /**
     * set active editor and subscribe to model data changes
     */
    public ngAfterViewInit() {
        this.setActiveEditor(this.model.data.body_html, this.model.data.body_spb);
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
        if (!!this.componentconfig.bodyHtmlField) this.bodyHtmlField = this.componentconfig.bodyHtmlField;
        if (!!this.componentconfig.bodySPBField) this.bodySPBField = this.componentconfig.bodySPBField;
    }

    /**
     * subscribe to model data changes
     * @private
     */
    private subscribeToModelChanges() {
        this.subscription.add(
            this.model.data$.subscribe(data =>
                this.setActiveEditor(data.body_html, data.body_spb)
            )
        );
    }

    /**
     * set the active editor
     * @param body
     * @param bodySPB
     * @private
     */
    private setActiveEditor(body: string, bodySPB: string) {
        this.activeEditor = !body ? undefined : (!bodySPB || _.isEmpty(bodySPB)) ? 'richText' : 'pageBuilder';
        this.cdRef.detectChanges();
    }

    /**
     * set the selected type
     * @param value
     * @private
     */
    private setSelectedTab(value: 'editor' | 'preview') {
        if (value == 'preview' && !this.model.data[this.bodyHtmlField]) return;
        this.selectedTab = value;
    }

    /**
     * sets the edit mode on the view and the model into editmode itself
     */
    public setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
        this.cdRef.detectChanges();
    }
}
