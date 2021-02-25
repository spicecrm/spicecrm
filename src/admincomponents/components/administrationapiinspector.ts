/**
 * @module AdminComponentsModule
 */
import {Component, OnInit, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';

@Component({
    templateUrl: './src/admincomponents/templates/administrationapiinspector.html',
})
export class AdministrationAPIInspector implements OnInit {

    /**
     * indicates that we are loading
     *
     * @private
     */
    private loading: boolean = false;

    /**
     * holds all the endpoints
     *
     * @private
     */
    private apiEndpoints: any[] = [];

    constructor(private backend: backend, private toast: toast, private modal: modal, private injector: Injector) {
    }

    public ngOnInit() {
        this.loadEndpoints();
    }

    /**
     * loads all available endpoints from the backend
     *
     * @private
     */
    private loadEndpoints() {
        this.loading = true;
        this.backend.getRequest('routes').subscribe(
            routes => {
                this.apiEndpoints = routes;
                this.apiEndpoints.sort((a, b) => a.route.localeCompare(b.route));
                this.loading = false;
            },
            err => {
                this.toast.sendToast('Error Loading Routes', 'error');
                this.loading = false;
            }
        );
    }

    /**
     * opens a modal to details more details
     *
     * @param apiendpoint
     * @private
     */
    private showDetails(apiendpoint: any) {
        this.modal.openModal('AdministrationAPIInspectorDetails').subscribe(modalRef => {
            modalRef.instance.endpoint = apiendpoint;
        });
    }

}
