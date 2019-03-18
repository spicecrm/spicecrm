/**
 * @module AdminComponentsModule
 */
import {Component, Pipe, PipeTransform, OnInit} from '@angular/core';
import {backend} from '../../services/backend.service';
import {Observable, Subject} from "rxjs";


/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'administration-dict-repair',
    templateUrl: './src/admincomponents/templates/administrationdictrepair.html'
})
export class AdministrationDictRepair implements OnInit {

    loading: boolean = true;
    repairsql: string = '';
    lastDBError: string = '';

    constructor(private backend: backend) {
    }

    ngOnInit(): void {
        this.getRepairSQL();
    }

    getRepairSQL(){
        this.loading = true;
        this.backend.getRequest('dictionary/repair').subscribe((result:any) => {
           this.repairsql = result.sql;
           this.loading = false;
        });
    }

    doRepair(){
        this.backend.postRequest('dictionary/repair',{},{sql: btoa(this.repairsql)}).subscribe((result:any) => {
            this.lastDBError = result.response;
        });
    }

}