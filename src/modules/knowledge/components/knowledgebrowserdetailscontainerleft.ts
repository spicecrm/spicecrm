/**
 * @module ModuleKnowledge
 */
import {Component, Input, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
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
        this.knowledgeService.selectedId = id;
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private print() {
        let printWindow = window.open('', 'PRINT');

        printWindow.document.write(
            `<html><head><title>${this.model.data.name}</title></head>
                    <style>@import url('https://fonts.googleapis.com/css?family=Titillium+Web');
                     * {font-family: 'Titillium Web', sans-serif; font-weight: 300;}</style>
                    <body>${this.model.data.description}</body></html>`);
        printWindow.document.close();
        printWindow.focus();

        printWindow.print();
        printWindow.close();
        return true;
    }

}
