/**
 * @module Admin Inspector Module
 */
import {Component, OnInit, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';
import {classNames} from "@angular/cdk/schematics";
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

@Component({
    selector: '[administration-api-inspector]',
    templateUrl: './src/admincomponents/templates/administrationapiinspector.html',
    providers: [administrationapiinspectorService]
})

export class AdministrationAPIInspector {

    /**
     * holds all the endpoints
     *
     * @private
     */
    private toggleClassSub = [];

    constructor(
        private toast: toast,
        private modal: modal,
        private injector: Injector,
        private apiinspector: administrationapiinspectorService
    ) {
    }

    /**
     * toggels the unauthorized filter
     *
     * @param e
     * @private
     */
    private toggleUnauthorized(e: MouseEvent) {
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
    private toggleAdminOnly(e: MouseEvent) {
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
    private toggleValidatedOnly(e: MouseEvent) {
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

    private selectNode(selectedId: string) {

        this.apiinspector.selectAPI(selectedId);
    }


}

