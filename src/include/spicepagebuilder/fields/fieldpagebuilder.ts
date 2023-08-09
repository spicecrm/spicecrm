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
    templateUrl: '../templates/fieldpagebuilder.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class fieldPageBuilder extends fieldGeneric implements OnInit, AfterViewInit {
    /**
     * holds the spice page builder html code
     * @private
     */
    public parsedHtml: SafeResourceUrl;
    /**
     * holds the iframe height
     * @private
     */
    public iframeHeight: number = 250;

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
     * return the page builder json field name
     */
    get bodySPBFieldName(): string {
        return this.fieldconfig.bodySPBField ?? 'body_spb';
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
    public modelChangesSubscriber() {
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
    public setHtmlValue() {
        if (!this.value) return;
        this.parsedHtml = this.sanitizer.bypassSecurityTrustResourceUrl('data:text/html;charset=UTF-8,' + encodeURIComponent(this.value));
        this.cdRef.detectChanges();
    }

    /**
     * set the iframe initial height
     * @private
     */
    public setIframeHeight() {
        const height = parseInt(this.fieldconfig.initialHeight, 10);
        if (!height || isNaN(height)) return;
        this.iframeHeight = height;
    }

    /**
     * set the page builder field value
     * @param val
     */
    public onPageBuilderChange(val) {

        this.model.setField(this.bodySPBFieldName, val);

        this.backend.postRequest('common/mjml/json2html', {}, {json: val}).subscribe({
            next: res => {
                if (!res.html) this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                this.model.setField(this.fieldname, res.html);
            }
        });
    }
}
