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
    templateUrl: "../templates/knowledgedocumentrelatedlist.html",
    providers: [relatedmodels]
})
export class KnowledgeDocumentRelatedList implements OnInit, OnDestroy {
    public componentconfig: any = {};
    public subscription: Subscription = new Subscription();

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public knowledgeService: KnowledgeService,
        public location: Location,
        public router: Router,
        public model: model,
        public modal: modal,
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

    public navigateTo(id) {
        this.knowledgeService.selectedDoc = id;
        this.location.replaceState("/module/KnowledgeDocuments/" + id);
    }

    public trackByFn(index, item) {
        return item.id;
    }
}
