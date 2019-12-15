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
    templateUrl: './src/modules/deployment/templates/deploymentcrdbentries.html',
})
export class DeploymentCRDBEntries implements OnInit {

    /**
     * the entries loaded
     */
    private dbEntries: any[] = [];

    /**
     * loading indicatopr
     */
    private loading = true;

    constructor(private model: model, private backend: backend, private language: language, private modal: modal, private injector: Injector) {

    }

    /**
     * initialize the panel
     */
    public ngOnInit() {
        this.backend.getRequest('systemdeploymentcrs/getDetailDBEntries/' + this.model.id).subscribe(entries => {
            this.dbEntries = entries;
            this.loading = false;
        });
    }

    /**
     * opens a modal with the SQL for copy & paste
     */
    private getSQL() {
        this.modal.openModal('DeploymentCRDBSQL', true, this.injector)
    }

    /**
     * simple getter for the count
     */
    get itemcount(){
        return this.dbEntries.length;
    }
}
