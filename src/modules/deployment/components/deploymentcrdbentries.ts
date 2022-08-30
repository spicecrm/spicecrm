/**
 * @module ModuleDeployment
 */
import {Component,OnInit, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';

/**
 * renders a subpanel with the Database entries associated with a CR
 */
@Component({
    templateUrl: '../templates/deploymentcrdbentries.html',
})
export class DeploymentCRDBEntries implements OnInit {

    /**
     * the entries loaded
     */
    public dbEntries: any[] = [];

    /**
     * loading indicatopr
     */
    public loading = true;

    constructor(public model: model, public backend: backend, public language: language, public modal: modal, public injector: Injector) {

    }

    /**
     * initialize the panel
     */
    public ngOnInit() {
        this.reload();
    }

    /**
     * loads/reloads the records
     */
    public reload(){
        this.dbEntries = [];
        this.loading = true;
        this.backend.getRequest('module/SystemDeploymentCRs/' + this.model.id + '/detaildbentries').subscribe(entries => {
            this.dbEntries = entries
            entries.forEach(e => {

                let label = e.tableaction;

                switch (e.tableaction) {
                    case 'I':
                        label = 'LBL_CREATE';
                        break;
                    case 'U':
                        label = 'LBL_UPDATE';
                        break;
                    case 'D':
                        label = 'LBL_DELETE';
                        break;
                }
                e.tableaction = this.language.getLabel(label);
            });
            this.loading = false;
        });
    }

    /**
     * opens a modal with the SQL for copy & paste
     */
    public getSQL() {
        this.modal.openModal('DeploymentCRDBSQL', true, this.injector)
    }

    /**
     * simple getter for the count
     */
    get itemcount(){
        return this.dbEntries.length;
    }
}
