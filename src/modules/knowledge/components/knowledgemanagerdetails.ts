/**
 * @module ModuleKnowledge
 */
import {Component, Input, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {KnowledgeService} from "../services/knowledge.service";

@Component({
    selector: "knowledge-manager-details",
    templateUrl: "./src/modules/knowledge/templates/knowledgemanagerdetails.html",
    providers: [view]
})
export class KnowledgeManagerDetails {

    @ViewChild("detailscontent", {read: ViewContainerRef}) private detailsContent: ViewContainerRef;
    @Input("selectedId") private docId: string = "";
    private renderedComponents: any[] = [];

    constructor(private language: language,
                private model: model,
                private view: view,
                private knowledgeService: KnowledgeService,
                private metadata: metadata) {
        this.model.module = "KnowledgeDocuments";
    }

    private ngOnChanges() {
        if (this.docId && this.docId !== "") {
            this.view.setViewMode();
            this.resetView();
            this.model.id = this.docId;
            this.model.getData(true, "", true).subscribe(data => this.buildContainer());
        }
    }

    get selectedBook() {
        return this.knowledgeService.selectedBook;
    }

    private resetView() {
        for (let renderedComponent of this.renderedComponents) {
            renderedComponent.destroy();
        }
        this.renderedComponents = [];
    }

    private buildContainer() {
        let componentconfig = this.metadata.getComponentConfig("KnowledgeManagerDetails", "KnowledgeDocuments");
        let componentSet = componentconfig.componentset;

        if (componentSet) {
            let components = this.metadata.getComponentSetObjects(componentSet);
            for (let component of components) {
                this.metadata.addComponent(component.component, this.detailsContent).subscribe(componentref => {
                    this.renderedComponents.push(componentref);
                    componentref.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }
}
