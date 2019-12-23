 /**
 * @module ModuleKnowledge
 */
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {KnowledgeService} from "../services/knowledge.service";
import {Observable, Subject} from "rxjs";

@Component({
    selector: 'knowledge-manager-add-modal',
    templateUrl: "./src/modules/knowledge/templates/knowledgemanageraddmodal.html",
    providers: [model, KnowledgeService]
})
export class KnowledgeManagerAddModal implements AfterViewInit {

    public config: any = {clickable: true};
    public activeTab: string = "tree";
    public self: any = {};
    public presets: any = {};
    private showCopyContainer: boolean = false;
    private response: Observable<object> = null;
    private responseSubject: Subject<any> = null;

    @ViewChild("maincontainer", {read: ViewContainerRef, static: true}) private maincontainer: ViewContainerRef;
    @ViewChild("tabsheadercontainer", {read: ViewContainerRef, static: true}) private tabsHeaderContainer: ViewContainerRef;
    @ViewChild("footerContainer", {read: ViewContainerRef, static: true}) private footerContainer: ViewContainerRef;

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
                private knowledgeService: KnowledgeService) {
        this.model.module = "KnowledgeDocuments";
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
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
    }

    public openNewModal() {
        this.model.id = '';
        this.self.destroy();
        this.model.addModel("", {}, this.presets)
            .subscribe(res => {
                this.responseSubject.next(res);
                this.responseSubject.complete();
            });
    }

    private confirmCopy() {
        this.copyPresets();
        this.model.save(true).subscribe(res => {
            this.responseSubject.next(this.model.data);
            this.responseSubject.complete();
        });
        this.close();
    }

    private copyPresets() {
        let newGUID = this.model.generateGuid();
        this.model.id = newGUID;
        this.model.data.id = newGUID;

        for (let key in this.presets) {
            if (this.presets.hasOwnProperty(key)) {
                this.model.data[key] = this.presets[key];
            }
        }
    }

    private close() {
        this.self.destroy();
    }
}
