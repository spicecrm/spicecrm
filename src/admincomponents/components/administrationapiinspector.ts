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
    providers:[administrationapiinspectorService]
})

export class AdministrationAPIInspector implements OnInit {

    /**
     * holds all the endpoints
     *
     * @private
     */
    private toggleClassSub =[];

    constructor(
        private toast: toast,
        private modal: modal,
        private injector: Injector,
        private apiinspector: administrationapiinspectorService
        ) {}


    /**
     * loads the endpoints from the backend
     *
     * @public
     */
    public ngOnInit() {
        this.apiinspector.loadEndpoints();
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

