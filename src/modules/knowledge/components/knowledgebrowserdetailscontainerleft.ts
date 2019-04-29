/**
 * @module ModuleKnowledge
 */
import {Component, Input, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {KnowledgeService} from "../services/knowledge.service";

@Component({
    selector: "knowledge-browser-details-container-left",
    templateUrl: "./src/modules/knowledge/templates/knowledgebrowserdetailscontainerleft.html"
})
export class KnowledgeBrowserDetailsContainerLeft {

    @ViewChild('printframe', {read: ViewContainerRef}) private printFrame: ViewContainerRef;
    @ViewChild('headercontainer', {read: ViewContainerRef}) private headerContainer: ViewContainerRef;
    @Input("breadcrumbs") private breadcrumbs: any[] = [];

    constructor(private language: language,
                private model: model,
                private modal: modal,
                private viewContainerRef: ViewContainerRef,
                private knowledgeService: KnowledgeService) {
    }

    get iframContainerStyle() {
        if (this.headerContainer) {
            let rect = this.headerContainer.element.nativeElement.getBoundingClientRect();
            return {height: `calc(100vh - ${rect.bottom}px)`, width: "100%"};
        }
        return {};
    }

    get hasContent() {
        return this.model.data.description != '' || this.model.data.description.length > 0;
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
