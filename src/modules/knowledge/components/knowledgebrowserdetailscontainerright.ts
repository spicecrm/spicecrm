/**
 * @module ModuleKnowledge
 */
import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: "knowledge-browser-details-container-right",
    templateUrl: "./src/modules/knowledge/templates/knowledgebrowserdetailscontainerright.html"
})
export class KnowledgeBrowserDetailsContainerRight implements OnInit, OnDestroy {
    public componentconfig: any = {};
    @ViewChild("itemscontainer", {read: ViewContainerRef}) private itemsContainer: ViewContainerRef;
    private renderedComponents: any[] = [];

    constructor(private language: language,
                private model: model,
                private metadata: metadata) {
    }

    public ngOnInit() {
        this.buildContainer();
    }

    public ngOnDestroy() {
        for (let renderedComponent of this.renderedComponents) {
            renderedComponent.destroy();
        }
        this.renderedComponents = [];
    }

    private buildContainer() {
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
}
