/**
 * @module SpiceInstaller
 */

import { Component, Input } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {toast} from '../../../services/toast.service';
import { spiceinstaller, stepObject } from "../services/spiceinstaller.service";

@Component({
    selector: 'spice-installer-systemcheck',
    templateUrl: '../templates/spiceinstallersystemcheck.html',
})
export class SpiceInstallerSystemCheck {

    @Input() public selfStep: stepObject;
    public loading: boolean = false;
    public requirements: any = [];

    constructor(
        public toast: toast,
        public http: HttpClient,
        public spiceinstaller: spiceinstaller
    ) {
        this.spiceinstaller.jumpSubject.subscribe( fromTo => {
            if ( !fromTo.to ) return;
            if ( fromTo.from === this.selfStep ) {
                if( this.selfStep.completed || fromTo.to?.pos < this.selfStep.pos ) this.spiceinstaller.jump( fromTo.to );
            }
        });
        this.checkSystem();
    }

    get checkFailed(){

        for(let req of Object.values(this.requirements)){
            if(!req) return true;
        }

        return false;
    }

    public checkSystem() {
        this.loading = true;
        this.http.get(`${this.spiceinstaller.systemurl}/install/check`).subscribe((response: any) => {
            this.loading = false;
            let result = response;
            this.requirements = result.requirements;
            if (result.success) {
                this.selfStep.completed = true;
                this.spiceinstaller.dbdrivers = this.requirements.dbdrivers;
            } else {
                this.toast.sendToast('error, missing requirements', "error");
            }
        },(err: any) => {
            this.loading = false;
            switch (err.status) {
                case 500:
                    this.toast.sendAlert(err.message, 'error');
                    break;
            }
        });
    }

}
