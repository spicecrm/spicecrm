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
import {Component, Input, OnChanges, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {favorite} from "../../../services/favorite.service";
import {KnowledgeService} from "../services/knowledge.service";
import {KnowledgeBrowserDetailsContainerRight} from "./knowledgebrowserdetailscontainerright";

@Component({
    selector: "knowledge-browser-details",
    templateUrl: "./src/modules/knowledge/templates/knowledgebrowserdetails.html"
})
export class KnowledgeBrowserDetails implements OnChanges {

    @ViewChild('detailscontainer', {read: ViewContainerRef, static: true}) private detailsContainer: ViewContainerRef;
    @ViewChild(KnowledgeBrowserDetailsContainerRight, {static: true}) private rightPanelContainer;

    @Input("selectedDoc") private docId: string = "";
    @Input() private inAddModal: boolean = false;
    @Input() private footerContainer: any;

    constructor(private language: language,
                private favorite: favorite,
                private knowledgeService: KnowledgeService,
                private model: model) {
        this.model.module = "KnowledgeDocuments";
    }

    private _breadcrumbs: any[] = [];

    get containerLeftClass() {
        return this.inAddModal ? 'slds-size--1-of-1' : 'slds-size--2-of-3';
    }

    get breadcrumbs() {
        return this._breadcrumbs;
    }

    set breadcrumbs(value) {
        this._breadcrumbs = value;
    }

    get selectedBook() {
        return this.knowledgeService.selectedBook;
    }

    get detailsContainerStyle() {
        if (!this.detailsContainer) return {};
        let rect = this.detailsContainer.element.nativeElement;

        if (this.footerContainer && this.inAddModal) {
            let footerTop = this.footerContainer.parentElement.offsetTop;
            return {
                height: (footerTop - rect.offsetTop) + 'px',
            };
        }
        return {height: `calc(100vh - ${rect.offsetTop}px)`};
    }

    public ngOnChanges() {
        if (this.rightPanelContainer) {
            this.rightPanelContainer.resetView();
        }
        if (this.docId && this.docId.length > 0) {
            this.model.id = this.docId;
            if (this.rightPanelContainer) {
                this.rightPanelContainer.renderView();
            }

            // ToDo: check if we stiull need that or can avoid this for favs on the knkowledge books
            // this.knowledgeService.favoriteEnable(this.model.module, this.model.id);

            this.breadcrumbs = [];
            this.model.getData(true, "", true)
                .subscribe(data => {
                    if (data.breadcrumbs && data.breadcrumbs.length > 0) {
                        this.breadcrumbs = data.breadcrumbs;
                    }
                });
        }
    }
}
