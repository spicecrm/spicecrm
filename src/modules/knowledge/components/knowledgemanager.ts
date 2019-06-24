/**
 * @module ModuleKnowledge
 */
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {KnowledgeService} from "../services/knowledge.service";
import {Router} from "@angular/router";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'knowledge-manager',
    templateUrl: "./src/modules/knowledge/templates/knowledgemanager.html",
    providers: [model, KnowledgeService]
})
export class KnowledgeManager implements AfterViewInit {

    public config: any = {clickable: true, canadd: true, draggable: true};
    public activeTab: string = "tree";

    @ViewChild("maincontainer", {read: ViewContainerRef}) private maincontainer: ViewContainerRef;
    @ViewChild("tabsheadercontainer", {read: ViewContainerRef}) private tabsHeaderContainer: ViewContainerRef;

    constructor(private language: language,
                private model: model,
                private modal: modal,
                private backend: backend,
                private router: Router,
                private metadata: metadata,
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
        this.modal.openModal('KnowledgeManagerAddModal', true)
            .subscribe(modalRef => {
                modalRef.instance.presets = presets;
                modalRef.instance.response.subscribe(res => {
                    if (typeof res === "object") {
                        this.knowledgeService.selectedDoc = res.id;
                    }
                });
            });
    }

    private changeItemPosition(toEdit: any) {
        let data = {
            parent_id: toEdit.parent_id,
            parent_sequence: toEdit.parent_sequence
        };
        this.backend.save("KnowledgeDocuments", toEdit.id, data);
        this.knowledgeService.documents.some(doc => {
            if (doc.id === toEdit.id) {
                doc.parent_id = toEdit.parent_id;
                doc.parent_sequence = toEdit.parent_sequence;
                return true;
            }
        });
        this.knowledgeService.selectedDoc = toEdit.id;
    }

    private handleSelectedItemEvent(id) {
        this.knowledgeService.selectedDoc = id;
        this.knowledgeService.replaceState("/module/KnowledgeDocuments/" + id);
    }
}
