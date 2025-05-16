/**
 * @module ModuleKPIs
 */

import {Component, OnInit} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";
import {layout} from "../../../services/layout.service";

@Component({
    selector: 'kpis-dashlet',
    templateUrl: '../templates/kpisdashlet.html'
})

export class KPIsDashlet implements OnInit {

    /**
     * parentId the KPITarget is related to
     */
    public parentId: string = '';

    /**
     * parentType the KPITarget is related to
     * i.e. Users, CompanyCodes etc.
     */
    public parentType: string = 'Users';

    /**
     * an array with all reportees
     */
    public reportees: any[] = [];

    constructor(
        public session: session,
        public backend: backend,
        public toast: toast,
        public layout: layout,
        public modal: modal
    ) {
    }

    ngOnInit() {
        this.parentId = this.session.authData.user.id;
        this.getReporteeIDs();
    }

    private getReporteeIDs(){
        this.backend.getRequest(`module/KPIs/reportees/${this.session.authData.user.id}`).subscribe({
            next: (reportees) => {
                if(reportees.length > 0){
                    this.reportees = reportees;
                }

                // add the current user
                this.reportees.push(this.session.authData.user);

                // sort the users
                this.reportees.sort((a,b) => a.last_name.localeCompare(b.last_name));
            }
        })
    }
}