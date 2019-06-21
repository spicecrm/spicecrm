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
import {Location} from "@angular/common";

@Component({
    templateUrl: "./src/modules/knowledge/templates/knowledgecontainer.html"

})
export class KnowledgeContainer implements AfterViewInit, OnDestroy {

    private id: string;
    private module: string;
    private viewInitialized: boolean = false;
    private subscription: Subscription = new Subscription();
    @ViewChild('knowledgeContainer',{read: ViewContainerRef, static: false}) private container: ViewContainerRef;


    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private backend: backend,
                private location: Location,
                private language: language,
                private toast: toast,
                private metadata: metadata) {
        this.routerSubscriber();
    }

    public ngAfterViewInit() {
        this.viewInitialized = true;
        this.renderView();
    }

    private routerSubscriber() {
        this.subscription = this.activatedRoute.params.subscribe(params => {
            if (!params.module) this.router.navigate(['module/Home']);

            this.module = params.module;
            if (params.id) {
                this.id = params.id;
            }
            if (this.viewInitialized) {
                this.renderView();
            }
        });
    }

    private renderView() {
        if (!this.module) return;
        let component = this.metadata.checkModuleAcl(this.module,'edit') ? 'KnowledgeManager' : 'KnowledgeBrowser';
        if (this.id) {
            this.backend.get(this.module, this.id).subscribe(
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
                    } else {
                        this.metadata.addComponent(component, this.container);
                    }
                },
                error => {
                    this.metadata.addComponent(component, this.container);
                    this.location.replaceState("/module/" + this.module);
                    this.toast.sendToast(this.language.getLabel("LBL_ERROR_LOADING_RECORD"), "error");
                });
        } else {
            this.metadata.addComponent(component, this.container);
        }
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
