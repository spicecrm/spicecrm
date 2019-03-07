/**
 * @module ModuleDeployment
 */
import {Component,OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';

@Component({
    templateUrl: './src/modules/deployment/templates/deploymentcrdbentries.html',
})
export class DeploymentCRDBEntries implements OnInit {

    dbEntries: Array<any> = [];
    loading = true;

    constructor(private model: model, private backend: backend, private language: language, private modal: modal) {

    }

    ngOnInit() {
        this.backend.getRequest('systemdeploymentcrs/getDetailDBEntries/' + this.model.id).subscribe(entries => {
            this.dbEntries = entries;
            this.loading = false;
        })
    }

    getSQL() {
        this.modal.openModal('DeploymentCRDBSQL').subscribe(component => {
            component.instance.crqid = this.model.id;
        })
    }

    get itemcount(){
        return this.dbEntries.length;
    }
}