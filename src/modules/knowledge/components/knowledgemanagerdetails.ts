/**
 * @module ModuleKnowledge
 */
import {Component, Input, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {KnowledgeService} from "../services/knowledge.service";

@Component({
    selector: "knowledge-manager-details",
    templateUrl: "../templates/knowledgemanagerdetails.html",
    providers: [model, view]
})
export class KnowledgeManagerDetails implements OnDestroy {

    @ViewChild("detailscontent", {read: ViewContainerRef, static: true}) public detailsContent: ViewContainerRef;
    @Input("selectedDoc") public docId: string = "";
    public renderedComponents: any[] = [];

    constructor(public language: language,
                public model: model,
                public view: view,
                public knowledgeService: KnowledgeService,
                public metadata: metadata) {
        this.model.module = "KnowledgeDocuments";
    }

    get selectedBook() {
        return this.knowledgeService.selectedBook;
    }

    public ngOnChanges() {
        this.resetView();
        if (this.docId && this.docId !== "") {
            this.view.setViewMode();
            this.model.id = this.docId;

            // ToDo: check if we stiull need that or can avoid this for favs on the knkowledge books
            // this.knowledgeService.favoriteEnable(this.model.module, this.model.id);

            this.model.getData(true, "", true).subscribe(data => this.renderView());
        }
    }

    public ngOnDestroy() {
        this.resetView();
    }

    public resetView() {
        for (let renderedComponent of this.renderedComponents) {
            renderedComponent.destroy();
        }
        this.renderedComponents = [];
    }

    public renderView() {
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
