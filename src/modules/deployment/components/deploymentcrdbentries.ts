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
        this.backend.getRequest('module/SystemDeploymentCRs/' + this.model.id + '/detaildbentries').subscribe(entries => {
            this.dbEntries = entries;
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
