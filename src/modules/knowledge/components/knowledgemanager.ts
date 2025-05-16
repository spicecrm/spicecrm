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
    templateUrl: "../templates/knowledgemanager.html",
    providers: [model, KnowledgeService]
})
export class KnowledgeManager implements AfterViewInit {

    public config: any = {canadd: true, draggable: true, expandall: false};
    public activeTab: string = "tree";

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public backend: backend,
                public router: Router,
                public metadata: metadata,
                public navigationTab: navigationtab,
                public injector: Injector,
                public viewContainerRef: ViewContainerRef,
                public knowledgeService: KnowledgeService) {
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

    get isLoading() {
        return this.knowledgeService.isDocumentLoading;
    }

    public ngAfterViewInit() {
        this.knowledgeService.setActiveModule("KnowledgeBooks");
        if (this.navigationTab.activeRoute.path == 'KnowledgeManager') {
            this.navigationTab.setTabInfo({displayname: 'Knowledge Manager', displayicon: 'table'});
        }
    }

    public checkAccess() {
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

    public handleTreeDrop(toEdit) {
        if (toEdit.newSortSequences) {
            this.backend.postRequest('module/KnowledgeDocuments/List/modifysortsequence', {}, toEdit.newSortSequences);
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
