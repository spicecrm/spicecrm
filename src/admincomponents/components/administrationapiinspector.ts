/**
 * @module Admin Inspector Module
 */
import {Component, OnInit, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';
import {classNames} from "@angular/cdk/schematics";
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";
import {SystemSelectModuleModal} from "../../systemcomponents/components/systemselectmodulemodal";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: '[administration-api-inspector]',
    templateUrl: '../templates/administrationapiinspector.html',
    providers: [administrationapiinspectorService],
    standalone: false
})

export class AdministrationAPIInspector {

    /**
     * holds all the endpoints
     *
     * @private
     */
    public toggleClassSub = [];

    constructor(
        public toast: toast,
        public modal: modal,
        public injector: Injector,
        public apiinspector: administrationapiinspectorService,
        private metadata: metadata
    ) {
    }

    /**
     * toggels the unauthorized filter
     *
     * @param e
     * @private
     */
    public toggleUnauthorized(e: MouseEvent) {
       e.preventDefault();
       e.stopPropagation();
       this.apiinspector.apiFilterUnauthorized = !this.apiinspector.apiFilterUnauthorized;
    }

    /**
     * toggels the admin only filter
     *
     * @param e
     * @private
     */
    public toggleAdminOnly(e: MouseEvent) {
       e.preventDefault();
       e.stopPropagation();
       this.apiinspector.apiFilterAdminOnly = !this.apiinspector.apiFilterAdminOnly;
    }

    /**
     * toggels the admin only filter
     *
     * @param e
     * @private
     */
    public toggleValidatedOnly(e: MouseEvent) {
       e.preventDefault();
       e.stopPropagation();
       this.apiinspector.apiFilterValidatedOnly = !this.apiinspector.apiFilterValidatedOnly;
    }

    /**
     * opens a modal to details more details
     *
     * @param apiendpoint
     * @private
     */

    public selectNode(selectedId: string) {

        this.apiinspector.selectAPI(selectedId);
    }

    public exportSwagger(){
        if (!this.apiinspector.selectedAPI) {
            return;
        }

        const route = this.apiinspector.selectedAPI.route;
        const includeSubroutes = this.apiinspector.apiSubMethods;

        const exportSwaggerRequest = (modules?: string[]) => {

            const isDownloading = this.modal.await('LBL_DOWNLOADING');

            this.apiinspector.exportSwagger(route, includeSubroutes, modules).subscribe({
                    next: (downloadUrl) => {

                        const a: any = document.createElement("a");
                        document.body.appendChild(a);
                        a.href = downloadUrl;
                        a.download = `swagger_${route.replace(/\//g, '_')}.yaml`;
                        a.click();
                        a.remove();
                    },
                    error: (error) => {
                        this.toast.sendToast('Error exporting Swagger file', 'error');
                        isDownloading.next(true);
                        isDownloading.complete();
                    },
                    complete: () => {
                        isDownloading.next(true);
                        isDownloading.complete();
                    }
                },
            );
        };

        // if the route is a bean route, prompt to select a module to generate for the swagger file
        if (route.includes('{beanName}')) {
            this.modal.openStaticModal(SystemSelectModuleModal, true, this.injector).subscribe(modalRef => {

                modalRef.instance.modules = this.metadata.getModules();
                modalRef.instance.module$.subscribe({
                    next: module => {
                        exportSwaggerRequest([module]);
                    }
                });
            });
        } else {
            exportSwaggerRequest();
        }
    }
}

