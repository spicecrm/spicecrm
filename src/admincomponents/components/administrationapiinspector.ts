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
    templateUrl: '../templates/administrationapiinspector.html',
    providers: [administrationapiinspectorService]
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
        public apiinspector: administrationapiinspectorService
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


}

