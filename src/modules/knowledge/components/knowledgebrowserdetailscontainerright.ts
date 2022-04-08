/**
 * @module ModuleKnowledge
 */
import {Component, Input, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: "knowledge-browser-details-container-right",
    templateUrl: "../templates/knowledgebrowserdetailscontainerright.html"
})
export class KnowledgeBrowserDetailsContainerRight implements OnDestroy {
    public componentconfig: any = {};
    @ViewChild("itemscontainer", {read: ViewContainerRef, static: true}) public itemsContainer: ViewContainerRef;
    @Input("selectedDoc") public docId: string = "";
    public renderedComponents: any[] = [];

    constructor(public language: language,
                public metadata: metadata) {
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
