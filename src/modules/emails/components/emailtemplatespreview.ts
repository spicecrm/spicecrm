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
    templateUrl: "../templates/emailtemplatespreview.html",
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
    public viewType: { title: string, icon: string, value: string, width: number } = {
        title: 'LBL_DESKTOP',
        icon: 'desktop',
        value: 'desktop',
        width: 1024
    };

    /**
     * save the component subscriptions
     */
    public subscription: Subscription = new Subscription();
    /**
     * the selected item
     */
    public selectedItem: { id: string, module: string, text: string };
    /**
     * holds the search field placeholder
     */
    public placeholder: string;
    /**
     * holds the parsed html value
     * @private
     */
    public parsedHtml: SafeResourceUrl;
    /**
     * holds the body html field name from the parent
     * @private
     */
    @Input() public bodyHtmlField: string = 'body_html';
    /**
     * holds the preview for bean module name from parent
     * @private
     */
    @Input() public previewForBean: string;
    /**
     * holds the iframe height from parent
     * @private
     */
    @Input() public iframeHeight: number = 250;

    constructor(public language: language,
                public backend: backend,
                public metadata: metadata,
                public model: model,
                public modal: modal,
                public toast: toast,
                public sanitizer: DomSanitizer,
                public cdRef: ChangeDetectorRef) {
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
    public subscribeToModelChanges() {
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
    public setPlaceholder() {
        this.placeholder = !!this.previewForBean ? this.language.getModuleCombinedLabel('LBL_SEARCH', this.previewForBean) : this.language.getLabel('LBL_SEARCH');
        this.cdRef.detectChanges();
    }

    /**
     * opens a model search modal
     */
    public searchWithModal() {
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
    public clearSelectedItem() {
        this.selectedItem = undefined;
        this.parsedHtml = undefined;
        this.cdRef.detectChanges();
    }

    /**
     * parse the body by the spice template compiler
     * @private
     */
    public compileBody() {
        if (!this.model.id) return;
        const loadingModal = this.modal.await('LBL_PARSING_HTML');
        const body = {html: this.model.getField(this.bodyHtmlField)};
        this.backend.postRequest(`module/${this.model.module}/${this.model.id}/livecompile/${this.previewForBean}/${this.selectedItem.id}`, {}, body)
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
    public setViewType(value: string) {
        this.viewType = this.viewTypeOptions.find(type => type.value == value);
    }
}
