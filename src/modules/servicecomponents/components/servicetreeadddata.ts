/**
 * @module ServiceComponentsModule
 */
import {Component, Input, OnInit} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

/**
 * adding the additional data for the service categories (i.e. service queues)
 */

@Component({
    selector: 'service-tree-add-data',
    templateUrl: '../templates/servicetreeadddata.html',
    standalone: false
})

export class ServiceTreeAddData implements OnInit {

    /**
     * holds the add params
     */
    @Input() public addParams: any;

    /**
     * holds the queues
     */
    public queues: any[] = [];

    /**
     * holds the questionnaires
     */
    public questionnaires: any[] = [];

    constructor(
        public backend: backend,
        public toast: toast
    ) {

    }

    public ngOnInit(): void {
        // initialize the params from the add_params field
        this.initializeParams();

        // load the service queues
        this.loadQueues();

        // load the questionnaires
        this.loadQuestionnaires();
    }

    /**
     * initializes params set in the add_params field
     */
    public initializeParams(): void {
        if(!this.addParams) {
            this.addParams = {
                questionnaire_id: '',
                servicequeue_id: ''
            }
        }
    }

    /**
     * loads queues from the backend
     */
    public loadQueues(): void{
        this.backend.getRequest('module/ServiceQueues', {limit: 100}).subscribe({
            next: (result) => {
                this.queues = result.list.sort((a, b) => a.name.localeCompare(b.name));
            }, error: () => {
                this.toast.sendToast('LBL_ERROR_RETRIEVING_QUEUES', 'error');
            }
        })
    }

    /**
     * loads questionnaires from the backend
     */
    public loadQuestionnaires() {
        this.backend.getRequest('module/Questionnaires', {limit: 200}).subscribe(res => {
            this.questionnaires = res.list.sort((a, b) => a.name.localeCompare(b.name));
        })
    }
}