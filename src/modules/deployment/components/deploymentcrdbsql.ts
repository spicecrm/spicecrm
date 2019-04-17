/**
 * @module ModuleDeployment
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    templateUrl: './src/modules/deployment/templates/deploymentcrdbsql.html',
})
export class DeploymentCRDBSQL implements OnInit {

    self: any = undefined;
    loading = true;
    crqid: string = '';
    sql: string = '';

    constructor(private backend: backend, private language: language) {

    }

    ngOnInit() {
        this.backend.getRequest('systemdeploymentcrs/sql/' + this.crqid).subscribe(result => {
            this.loading = false;
            this.sql = result.sql;
        })
    }

    close(){
        this.self.destroy();
    }

}