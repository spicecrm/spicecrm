/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {toast} from '../../../services/toast.service';
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-database',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerdatabase.html'
})

export class SpiceInstallerDatabase {
    /**
     * condition booleans
     */
    private hostNameCondition: boolean = true;
    private userNameCondition: boolean = true;
    private dbNameCondition: boolean = true;

    private loading: boolean = false;

    constructor(
        private toast: toast,
        private http: HttpClient,
        private spiceinstaller: spiceinstaller
    ) {

    }

    /**
     * checks if a connection with the database is possible with the inserted input,
     * saves the configuration
     */
    private checkDB() {

        switch(this.spiceinstaller.db_type) {
            case 'mysql':
                this.spiceinstaller.db_host_instance = 'SQLEXPRESS';
                this.spiceinstaller.db_manager = 'MysqliManager';
                break;
            case 'pgsql' :
                this.spiceinstaller.db_manager = 'PostgreSQLManager';
                break;
            case 'sqlsrv':
                this.spiceinstaller.db_manager = 'SqlsrvManager';
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
            lc_collate: this.spiceinstaller.lc_collate,
            lc_ctype: this.spiceinstaller.lc_ctype
        };
        if(this.spiceinstaller.dbaccessuser == 'existinguser') {
            body.db_user_name = this.spiceinstaller.ext_db_user_name;
            body.db_password = this.spiceinstaller.ext_db_password;
        }
        this.hostNameCondition = this.spiceinstaller.db_host_name.length > 0;
        this.userNameCondition = this.spiceinstaller.db_user_name.length > 0;
        this.dbNameCondition = this.spiceinstaller.db_name.length > 0;

        if (this.hostNameCondition && this.userNameCondition && this.dbNameCondition) {
            this.loading = true;
            this.http.post(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/KREST/spiceinstaller/checkdb`, body).subscribe(
                (response: any) => {
                    this.loading = false;
                    var res = response;
                    if (!res.success) {
                        for (let e in res.errors) {
                            this.toast.sendAlert('Error: ' + res.errors[e], 'error');
                        }
                    } else {
                        this.spiceinstaller.configObject['database'] = res.config;
                        this.spiceinstaller.configObject['dboptions'] = {
                            persistance: this.spiceinstaller.persistent,
                            autofree: this.spiceinstaller.autofree,
                            debug: this.spiceinstaller.debug,
                            ssl: this.spiceinstaller.ssl,
                            collation: this.spiceinstaller.collation
                        }
                        if(this.spiceinstaller.dbaccessuser == 'newdbuser') {
                            this.spiceinstaller.configObject['databaseuser'] = {
                                db_user_name: this.spiceinstaller.new_db_user_name,
                                db_password: this.spiceinstaller.new_db_password
                            }
                        }
                        this.spiceinstaller.selectedStep.completed = true;
                        this.spiceinstaller.steps[3] = this.spiceinstaller.selectedStep;
                        this.spiceinstaller.next(this.spiceinstaller.steps[3]);
                    }
                });
        }
    }

}
