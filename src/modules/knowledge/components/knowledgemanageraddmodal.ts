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
