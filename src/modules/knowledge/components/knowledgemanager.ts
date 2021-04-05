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
import {AfterViewInit, Component, Injector, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {KnowledgeService} from "../services/knowledge.service";
import {Router} from "@angular/router";
import {modal} from "../../../services/modal.service";
import {navigationtab} from "../../../services/navigationtab.service";

@Component({
    selector: 'knowledge-manager',
    templateUrl: "./src/modules/knowledge/templates/knowledgemanager.html",
    providers: [model, KnowledgeService]
})
export class KnowledgeManager implements AfterViewInit {

    public config: any = {canadd: true, draggable: true, expandall: false};
    public activeTab: string = "tree";

    @ViewChild("maincontainer", {read: ViewContainerRef, static: true}) private maincontainer: ViewContainerRef;
    @ViewChild("tabsheadercontainer", {read: ViewContainerRef, static: true}) private tabsHeaderContainer: ViewContainerRef;

    constructor(private language: language,
                private model: model,
                private modal: modal,
                private backend: backend,
                private router: Router,
                private metadata: metadata,
                private navigationTab: navigationtab,
                private injector: Injector,
                private viewContainerRef: ViewContainerRef,
                private knowledgeService: KnowledgeService) {
        this.model.module = "KnowledgeDocuments";
        this.checkAccess();
    }

    get selectedBook() {
        return this.knowledgeService.selectedBook;
    }

    get documents() {
        return this.knowledgeService.documents;
    }


    set selectedDoc(id) {
        this.knowledgeService.selectedDoc = id;
        this.knowledgeService.replaceState("/module/KnowledgeDocuments/" + id);
    }

    get selectedDoc() {
        return this.knowledgeService.selectedDoc;
    }

    get treeContainerStyle() {
        if (this.tabsHeaderContainer) {
            let rect = this.tabsHeaderContainer.element.nativeElement.getBoundingClientRect();
            return {height: `calc(100vh - ${rect.bottom}px)`};
        }
    }

    get detailsContainerStyle() {
        if (this.maincontainer) {
            let rect = this.maincontainer.element.nativeElement;
            return {height: `calc(100vh - ${rect.offsetTop}px)`};
        }
    }

    get isLoading() {
        return this.knowledgeService.isDocumentLoading;
    }

    public ngAfterViewInit() {
        this.knowledgeService.setActiveModule("KnowledgeBooks");
        if (this.navigationTab.activeRoute.path == 'KnowledgeManager') {
            this.navigationTab.setTabInfo({displayname: 'Knowledge Manager', displayicon: 'table'});
        }
    }

    private checkAccess() {
        if (!this.metadata.checkModuleAcl(this.model.module,'edit')) {
            this.router.navigate(['module/KnowledgeBooks/browser']);
        }
        this.config.canadd = this.metadata.checkModuleAcl(this.model.module,'create');
    }

    public handleAddEvent(parent) {
        this.model.id = '';
        let presets = {
            parent_id: parent !== null ? parent.id : null,
            parent_name: parent !== null ? parent.name : "",
            knowledgebook_id: this.knowledgeService.selectedBook.id,
            status: "Draft"
        };
        this.modal.openModal('KnowledgeManagerAddModal', true, this.injector)
            .subscribe(modalRef => {
                modalRef.instance.presets = presets;
                modalRef.instance.response.subscribe(res => {
                    if (typeof res === "object") {
                        this.selectedDoc = res.id;
                    }
                });
            });
    }

    private handleTreeDrop(toEdit) {
        if (toEdit.newSortSequences) {
            this.backend.postRequest('module/KnowledgeDocument/List/modifySortSequence', {}, toEdit.newSortSequences);
        }

        if (!toEdit.itemWithNewParent) return;
        this.backend.save("KnowledgeDocuments", toEdit.itemWithNewParent.id, toEdit.itemWithNewParent);
        this.knowledgeService.documents.some(doc => {
            if (doc.id === toEdit.id) {
                doc.parent_id = toEdit.parent_id;
                doc.parent_sequence = toEdit.parent_sequence;
                this.knowledgeService.selectedDoc = toEdit.id;
                return true;
            }
        });
    }
}
