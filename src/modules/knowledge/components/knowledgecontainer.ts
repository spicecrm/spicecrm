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
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from "@angular/core";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {Location} from "@angular/common";

/**
 * handles the route and render the suitable view for the knowledge books/documents
 */
@Component({
    selector: 'knowledge-container',
    templateUrl: "./src/modules/knowledge/templates/knowledgecontainer.html"

})
export class KnowledgeContainer implements AfterViewInit, OnDestroy {

    private modelId: string;
    private module: 'KnowledgeBooks' | 'KnowledgeDocuments' = 'KnowledgeBooks';
    /**
     * needed to determine weather the view is rendered or not to render the suitable component properly
     */
    private viewInitialized: boolean = false;
    private subscription: Subscription = new Subscription();
    /**
     * view reference to render the suitable component inside
     */
    @ViewChild('knowledgeContainer', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;


    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private backend: backend,
                private location: Location,
                private language: language,
                private toast: toast,
                private navigationtab: navigationtab,
                private metadata: metadata) {
        this.routerSubscriber();
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        this.viewInitialized = true;
        this.renderView();
    }

    /**
     * @ignore
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * subscribe to navigation and set the module to render the suitable component
     */
    private routerSubscriber() {
        this.subscription = this.navigationtab.activeRoute$.subscribe(route => {
            let params = route.params;
            if (!params.module) this.router.navigate(['module/Home']);

            this.module = params.module;

            if (params.id) {
                this.modelId = params.id;
            }
            if (this.viewInitialized) {
                this.renderView();
            }
        });
    }

    /**
     * check for acl permission and render the suitable component depending on the user acl permissions
     * pass the inputs to the rendered component
     * display error toast if the record was not found
     */
    private renderView() {
        if (!this.module) return;
        let component = this.metadata.checkModuleAcl(this.module, 'edit') ? 'KnowledgeManager' : 'KnowledgeBrowser';

        // render the details for the record and pass the data to the component if the model id is set
        if (this.modelId) {
            this.backend.get(this.module, this.modelId).subscribe(
                (item: any) => {
                    if (item) {
                        this.metadata.addComponent(component, this.container).subscribe(componentRef => {
                            switch (this.module) {
                                case 'KnowledgeBooks':
                                    componentRef.instance.knowledgeService.selectedBook = item;
                                    break;
                                case 'KnowledgeDocuments':
                                    componentRef.instance.knowledgeService.selectedDoc = item.id;
                                    componentRef.instance.knowledgeService.selectedBook = {
                                        id: item.knowledgebook_id,
                                        name: item.knowledgebook_name
                                    };
                                    break;
                            }
                        });
                        this.navigationtab.setTabInfo({displayname: item.summary_text, displaymodule: this.module});
                    } else {
                        this.metadata.addComponent(component, this.container);
                    }
                },
                () => {
                    this.metadata.addComponent(component, this.container);
                    this.location.replaceState("/module/" + this.module);
                    this.toast.sendToast(this.language.getLabel("LBL_ERROR_LOADING_RECORD"), "error");
                });
        } else {
            this.metadata.addComponent(component, this.container);
        }
    }
}
