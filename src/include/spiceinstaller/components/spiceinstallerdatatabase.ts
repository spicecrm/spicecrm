/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    private charset: string = '';

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
        if (this.spiceinstaller.dbaccessuser == 'existinguser') {
            body.db_user_name = this.spiceinstaller.ext_db_user_name;
            body.db_password = this.spiceinstaller.ext_db_password;
        }

        this.hostNameCondition = this.spiceinstaller.db_host_name.length > 0;
        this.userNameCondition = this.spiceinstaller.db_user_name.length > 0;
        this.dbNameCondition = this.spiceinstaller.db_name.length > 0;

        if (this.hostNameCondition && this.userNameCondition && this.dbNameCondition) {
            this.loading = true;
            this.http.post(`${this.spiceinstaller.configObject.backendconfig.backendUrl}/install/checkdb`, body).subscribe(
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
                        if (this.spiceinstaller.dbaccessuser == 'newdbuser') {
                            this.spiceinstaller.configObject.databaseuser = {
                                db_user_name: this.spiceinstaller.new_db_user_name,
                                db_password: this.spiceinstaller.new_db_password
                            };
                        }
                        this.spiceinstaller.selectedStep.completed = true;
                        this.spiceinstaller.steps[3] = this.spiceinstaller.selectedStep;
                        this.spiceinstaller.next(this.spiceinstaller.steps[3]);
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
