/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: "./src/modules/knowledge/templates/knowledgemanagerdetails.html",
    providers: [model, view]
})
export class KnowledgeManagerDetails implements OnDestroy {

    @ViewChild("detailscontent", {read: ViewContainerRef, static: true}) private detailsContent: ViewContainerRef;
    @Input("selectedDoc") private docId: string = "";
    private renderedComponents: any[] = [];

    constructor(private language: language,
                private model: model,
                private view: view,
                private knowledgeService: KnowledgeService,
                private metadata: metadata) {
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

    private resetView() {
        for (let renderedComponent of this.renderedComponents) {
            renderedComponent.destroy();
        }
        this.renderedComponents = [];
    }

    private renderView() {
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
