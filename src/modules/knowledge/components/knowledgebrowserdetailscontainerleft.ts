/**
 * @module ModuleKnowledge
 */
import {Component, HostBinding, Input, SimpleChanges, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {KnowledgeService} from "../services/knowledge.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: "knowledge-browser-details-container-left",
    templateUrl: "./src/modules/knowledge/templates/knowledgebrowserdetailscontainerleft.html"
})
export class KnowledgeBrowserDetailsContainerLeft {

    @ViewChild('headercontainer', {read: ViewContainerRef, static: true}) private headerContainer: ViewContainerRef;
    @Input("breadcrumbs") private breadcrumbs: any[] = [];
    @Input("html") private html: any = '';
    @HostBinding('style') private height: string = '100%';

    constructor(private language: language,
                private model: model,
                private modal: modal,
                private sanitizer: DomSanitizer,
                private viewContainerRef: ViewContainerRef,
                private knowledgeService: KnowledgeService) {
    }

    get iframeContainerStyle() {
        if (this.headerContainer) {
            let rect = this.headerContainer.element.nativeElement.getBoundingClientRect();
            return {height: `calc(100vh - ${rect.bottom}px)`, width: "100%"};
        }
        return {};
    }

    get hasContent() {
        return this.model.data.description && this.model.data.description.length > 0;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.html && this.html) {
            this.setHtmlValue();
        }
    }

    private setHtmlValue() {
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

    private encodeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    private navigateTo(id) {
        this.knowledgeService.selectedDoc = id;
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private print() {
        this.modal.openModal('ObjectActionOutputBeanModal', true, this.viewContainerRef.injector);
    }
}
