/**
 * @module ModuleKnowledge
 */
import {Component, HostBinding, Input, SimpleChanges, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {KnowledgeService} from "../services/knowledge.service";
import {DomSanitizer} from "@angular/platform-browser";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {lastValueFrom} from "rxjs";

@Component({
    selector: "knowledge-browser-details-container-left",
    templateUrl: "../templates/knowledgebrowserdetailscontainerleft.html"
})
export class KnowledgeBrowserDetailsContainerLeft {

    @ViewChild('headercontainer', {read: ViewContainerRef, static: true}) public headerContainer: ViewContainerRef;
    @Input("breadcrumbs") public breadcrumbs: any[] = [];
    @Input("html") public html: any = '';
    @HostBinding('style') public height: string = '100%';
    private templates: any[] = [];

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public sanitizer: DomSanitizer,
                public configuration: configurationService,
                public backend: backend,
                public viewContainerRef: ViewContainerRef,
                public knowledgeService: KnowledgeService) {
    }

    get iframeContainerStyle() {
        if (this.headerContainer) {
            let rect = this.headerContainer.element.nativeElement.getBoundingClientRect();
            return {height: `calc(100vh - ${rect.bottom}px)`, width: "100%"};
        }
        return {};
    }

    get hasContent() {
        return this.model.getField('description') && this.model.getField('description').length > 0;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.html && this.html) {
            this.setHtmlValue();
        }
    }

    public setHtmlValue() {
    let regexp = /<code>[\s\S]*?<\/code>/g;
    let match = regexp.exec(this.html);
    while (match != null) {
        this.html = this.html
            .replace(match, this.encodeHtml(match))
            .replace('&lt;code&gt;', '<code>')
            .replace('&lt;/code&gt;', '</code>');
        match = regexp.exec(this.html);
    }
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.html);
}

    public encodeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    public navigateTo(id) {
        this.knowledgeService.selectedDoc = id;
    }

    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * open pdf output modal with the document templates
     */
    public async print() {

        let outputTemplates = this.templates.length > 0 ? this.templates : this.configuration.getData('OutputTemplates');

        if (!outputTemplates || !outputTemplates[this.model.module]) {

            const loadingModal = this.modal.await('LBL_LOADING');

            outputTemplates = await lastValueFrom(this.backend.getRequest('module/OutputTemplates/formodule/' + this.model.module, {})).catch(() => {
                loadingModal.next(false);
                loadingModal.complete();
            });

            this.templates = outputTemplates;

            this.configuration.setData('OutputTemplates', outputTemplates);
            loadingModal.next(true);
            loadingModal.complete();
        }

        if (this.templates.length > 0) {
            // sort the templates
            this.templates.sort((a, b) => a.name > b.name ? 1 : -1);

            // open the modal
            this.modal.openModal('ObjectActionOutputBeanModal', true, this.viewContainerRef.injector).subscribe(outputModal => {
                outputModal.instance.templates = this.templates;
            });
        } else {
            this.modal.info('No Templates Found', 'there are no Output templates defined for the Module');
        }
    }
}
