/**
 * @module SpiceInstallerModule
 */

import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";
import {spiceinstaller} from "../services/spiceinstaller.service";


@Component({
    selector: 'spice-installer-database',
    templateUrl: './src/include/spiceinstaller/templates/spiceinstallerdatabase.html'
})

export class SpiceInstallerDatabase {
    hostNameCondition: boolean = true;
    userNameCondition: boolean = true;
    dbNameCondition: boolean = true;
    private db_host_name: string = '';
    private db_host_instance: string = '';
    private db_user_name: string = '';
    private db_password: string = '';
    private db_name: string = '';
    private db_type: string = 'mysql';
    private db_port: string = '';
    private db_manager: string = '';
    private persistent: boolean = true;
    private autofree: boolean = false;
    private debug: number = 0;
    private ssl: boolean = false;
    private collation: string = 'utf8_general_ci';
    private configBody: any = {};

    constructor(
        private toast: toast,
        private http: HttpClient,
        private router: Router,
        private configurationService: configurationService,
        private backend: backend,
        private spiceinstaller: spiceinstaller
    ) {
        this.spiceinstaller.currentStep(3);
        this.spiceinstaller.configBody$.subscribe(data => {
            this.configBody = data;
        });
    }

    private checkDB() {
        if (this.db_type == 'mysql') {
            this.db_host_instance = 'SQLEXPRESS';
            this.db_manager = 'MysqliManager'
        }
        let body = {
            db_host_name: this.db_host_name,
            db_host_instance: this.db_host_instance,
            db_user_name: this.db_user_name,
            db_password: this.db_password,
            db_name: this.db_name,
            db_type: this.db_type,
            db_port: this.db_port,
            db_manager: this.db_manager
        };

        this.hostNameCondition = this.db_host_name.length > 0;
        this.userNameCondition = this.db_user_name.length > 0;
        this.dbNameCondition = this.db_name.length > 0;

        if (this.hostNameCondition && this.userNameCondition && this.dbNameCondition) {
            this.http.post(`${this.configBody.backendconfig.backendUrl}/KREST/spiceinstaller/checkdb`, body).subscribe(
                (response: any) => {
                    var res = response;
                    if (!res.success) {
                        for (let e in res.errors) {
                            this.toast.sendAlert('Error with: ' + e, 'error');
                        }
                    } else {
                        this.toast.sendToast('successful connection with database', 'success');
                        let dbConfig = {
                            database: res.config,
                            dboptions: {
                                persistance: this.persistent,
                                autofree: this.autofree,
                                debug: this.debug,
                                ssl: this.ssl,
                                collation: this.collation
                            }
                        };
                        const config = Object.assign(this.configBody, dbConfig);
                        this.spiceinstaller.configBody(config);
                        this.spiceinstaller.steps[3].completed = true;
                    }
                });
        }


    }

}
