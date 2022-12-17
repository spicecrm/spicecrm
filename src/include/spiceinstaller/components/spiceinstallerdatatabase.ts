/**
 * @module SpiceInstallerModule
 */

import { Component, Input } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {toast} from '../../../services/toast.service';
import { spiceinstaller, stepObject } from "../services/spiceinstaller.service";

@Component({
    selector: 'spice-installer-database',
    templateUrl: '../templates/spiceinstallerdatabase.html'
})
export class SpiceInstallerDatabase {

    @Input() public selfStep: stepObject;

    /**
     * condition booleans
     */
    public hostNameCondition: boolean = true;
    public userNameCondition: boolean = true;
    public dbNameCondition: boolean = true;

    public loading: boolean = false;

    public charset: string = '';

    constructor(
        public toast: toast,
        public http: HttpClient,
        public spiceinstaller: spiceinstaller
    ) {
        // if we only have one ... set the extension by default
        if(spiceinstaller.dbdrivers.length == 1){
            spiceinstaller.db_type = spiceinstaller.dbdrivers[0].extension;
        }
        this.spiceinstaller.jumpSubject.subscribe( fromTo => {
            if ( fromTo.from === this.selfStep ) {
                if ( this.selfStep.completed || fromTo.to?.pos < this.selfStep.pos ) this.spiceinstaller.jump( fromTo.to );
                else this.checkDB();
            }
        });
    }

    /**
     * checks if a connection with the database is possible with the inserted input,
     * saves the configuration
     */
    public checkDB() {
        switch (this.spiceinstaller.db_type) {
            case 'mysql': // backward compatibility
            case 'mysqli':
                this.spiceinstaller.db_host_instance = 'SQLEXPRESS';
                this.spiceinstaller.db_manager = 'MysqliManager';
                break;
            case 'pgsql' :
                this.spiceinstaller.db_manager = 'PostgreSQLManager';
                break;
            case 'mssql':
                this.spiceinstaller.db_manager = 'SqlsrvManager';
                break;
            case 'oci8':
                this.spiceinstaller.db_host_instance = 'SQLEXPRESS';
                this.spiceinstaller.db_manager = 'OCI8Manager';
                break;
        }

        switch (this.spiceinstaller.collation) {
            case 'utf8mb4_general_ci':
                this.charset = 'utf8mb4';
                break;
            case 'utf8_general_ci':
                this.charset = 'utf8';
                break;
        }

        let body = {
            db_host_name: this.spiceinstaller.db_host_name,
            db_host_instance: this.spiceinstaller.db_host_instance,
            db_user_name: this.spiceinstaller.db_user_name,
            db_password: this.spiceinstaller.db_password,
            db_name: this.spiceinstaller.db_name,
            db_type: this.spiceinstaller.db_type,
            db_port: this.spiceinstaller.db_port,
            db_manager: this.spiceinstaller.db_manager,
            db_schema: this.spiceinstaller.db_schema,
            lc_collate: this.spiceinstaller.lc_collate,
            lc_ctype: this.spiceinstaller.lc_ctype
        };

        this.hostNameCondition = this.spiceinstaller.db_host_name.length > 0;
        this.userNameCondition = this.spiceinstaller.db_user_name.length > 0;
        this.dbNameCondition = this.spiceinstaller.db_name.length > 0;

        if (this.hostNameCondition && this.userNameCondition && this.dbNameCondition) {
            this.loading = true;
            this.http.post(`${this.spiceinstaller.systemurl}/install/checkdb`, body).subscribe(
                (response: any) => {
                    this.loading = false;
                    let res = response;
                    if (!res.success) {
                        for (let e in res.errors) {
                            this.toast.sendAlert('Error: ' + res.errors[e], 'error');
                        }
                    } else {
                        this.spiceinstaller.configObject.database = res.config;
                        this.spiceinstaller.configObject.dboptions = {
                            persistance: this.spiceinstaller.persistent,
                            autofree: this.spiceinstaller.autofree,
                            debug: this.spiceinstaller.debug,
                            ssl: this.spiceinstaller.ssl,
                            collation: this.spiceinstaller.collation,
                            charset: this.charset
                        };
                        this.selfStep.completed = true;
                        this.spiceinstaller.jumpSubject.next({ from: this.selfStep, to: this.selfStep.next })
                    }
                },
                (error: any) => {
                    this.loading = false;
                    switch (error.status) {
                        case 500:
                            this.toast.sendAlert(error.message, 'error');
                            break;
                    }
                });
        }
    }

}
