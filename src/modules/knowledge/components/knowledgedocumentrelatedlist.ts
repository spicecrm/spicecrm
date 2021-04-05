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
