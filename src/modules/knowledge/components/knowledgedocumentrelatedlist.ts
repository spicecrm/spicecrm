/**
 * @module ModuleKnowledge
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {KnowledgeService} from "../services/knowledge.service";
import {Router} from '@angular/router';
import {Location} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
    selector: "Knowledge-document-related-list",
    templateUrl: "./src/modules/knowledge/templates/knowledgedocumentrelatedlist.html",
    providers: [relatedmodels]
})
export class KnowledgeDocumentRelatedList implements OnInit, OnDestroy {
    public componentconfig: any = {};
    private subscription: Subscription = new Subscription();

    constructor(
        private language: language,
        private metadata: metadata,
        private relatedmodels: relatedmodels,
        private knowledgeService: KnowledgeService,
        private location: Location,
        private router: Router,
        private model: model,
        private modal: modal,
    ) {
        this.relatedmodels.module = "KnowledgeDocuments";
        this.relatedmodels.relatedModule = "KnowledgeDocuments";
        this.subscription = this.model.data$.subscribe(data => {
            if (!data.id || data.id == "") {
                return;
            }
            this.relatedmodels.id = data.id;
            this.relatedmodels.sortfield = "name";
        });
    }

    get panelTitle() {
        return this.componentconfig.title ? this.componentconfig.title : "Related Documents";
    }

    get canEdit() {
        return this.componentconfig.editable == true && this.model.checkAccess('edit');
    }

    public ngOnInit() {
        if (this.componentconfig.items) {
            this.relatedmodels.loaditems = this.componentconfig.items;
        }

        if (this.componentconfig.link) {
            this.relatedmodels.linkName = this.componentconfig.link;
        }
    }

    public ngOnDestroy() {
        this.relatedmodels.stopSubscriptions();
        this.subscription.unsubscribe();
    }

    public openSelectModal() {
        if(!this.canEdit) {return;}
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.model.module;
            selectModal.instance.multiselect = true;
            selectModal.instance.selectedItems
                .subscribe(items => this.relatedmodels.addItems(items));
        });
    }

    private navigateTo(id) {
        this.knowledgeService.selectedDoc = id;
        this.location.replaceState("/module/KnowledgeDocuments/" + id);
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
