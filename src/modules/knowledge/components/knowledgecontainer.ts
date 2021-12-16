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
    templateUrl: "../templates/knowledgecontainer.html"

})
export class KnowledgeContainer implements AfterViewInit, OnDestroy {

    public modelId: string;
    public module: 'KnowledgeBooks' | 'KnowledgeDocuments' = 'KnowledgeBooks';
    /**
     * needed to determine weather the view is rendered or not to render the suitable component properly
     */
    public viewInitialized: boolean = false;
    public subscription: Subscription = new Subscription();
    /**
     * view reference to render the suitable component inside
     */
    @ViewChild('knowledgeContainer', {read: ViewContainerRef, static: true}) public container: ViewContainerRef;


    constructor(public activatedRoute: ActivatedRoute,
                public router: Router,
                public backend: backend,
                public location: Location,
                public language: language,
                public toast: toast,
                public navigationtab: navigationtab,
                public metadata: metadata) {
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
    public routerSubscriber() {
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
    public renderView() {
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
