/**
 * @module ModuleKnowledge
 */
import {Component, Input, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: "knowledge-browser-details-container-right",
    templateUrl: "./src/modules/knowledge/templates/knowledgebrowserdetailscontainerright.html"
})
export class KnowledgeBrowserDetailsContainerRight implements OnDestroy {
    public componentconfig: any = {};
    @ViewChild("itemscontainer", {read: ViewContainerRef}) private itemsContainer: ViewContainerRef;
    @Input("selectedId") private docId: string = "";
    private renderedComponents: any[] = [];

    constructor(private language: language,
                private model: model,
                private metadata: metadata) {
    }

    public ngOnInit() {
        this.renderView();
    }

    public ngOnDestroy() {
        this.resetView();
    }

    public renderView() {
        let componentconfig = this.metadata.getComponentConfig("KnowledgeBrowserDetailsContainerRight", "KnowledgeDocuments");
        let componentSet = componentconfig.componentset;

        if (componentSet) {
            let components = this.metadata.getComponentSetObjects(componentSet);
            for (let component of components) {
                this.metadata.addComponent(component.component, this.itemsContainer).subscribe(componentref => {
                    this.renderedComponents.push(componentref);
                    componentref.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }

    public resetView() {
        this.renderedComponents.forEach(comp => comp.destroy());
        this.renderedComponents = [];
    }
}
