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

    @ViewChild('headercontainer', {read: ViewContainerRef}) private headerContainer: ViewContainerRef;
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
        if (changes.html) {
            this.html = this.sanitizer.bypassSecurityTrustHtml(this.model.data.description);
        }
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
