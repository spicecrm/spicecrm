/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

@Component({
    templateUrl: "../templates/userdeactivatemodal.html"
})

export class UserDeactivateModal {

    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     * all objects linked to the assigned user
     */
    public objects: any[] = [];

    /**
     * inidcator that we are loading elements for the user
     */
    public loading = true;

    /**
     * boolean to indicate that teh records shopudl be reassigned
     */
    public reassignRecords: boolean = false;

    /**
     * the total number of records to be reassigned
     */
    public totalrecords: number = 0;

    /**
     * the userid to reassign the records to
     */
    public newuserid: string = '';

    constructor(public model: model, public modal: modal, public language: language, public backend: backend, public toast: toast) {
        this.getUserObjects();
    }

    /**
     * get objects assigned to the current user
     */
    public getUserObjects() {
        this.backend.getRequest(`module/Users/${this.model.id}/deactivate`).subscribe(
            res => {
                for (let moduleid in res) {
                    this.objects.push({
                        sysmoduleid: moduleid,
                        count: parseInt(res[moduleid].totalcount, 10),
                        reassign: parseInt(res[moduleid].totalcount, 10) > 0
                    });

                    // count the total records
                    this.totalrecords += parseInt(res[moduleid].totalcount, 10);
                }

                // set the reassign if we found records
                if (this.totalrecords > 0) this.reassignRecords = true;

                // set the loading flag
                this.loading = false;
            },
            error => {
                this.loading = false;
            });
    }

    /**
     * determine if records can be reassigned .. so if we foudn records.
     */
    get canReassign() {
        return this.totalrecords > 0;
    }

    get canSubmit() {
        if (this.reassignRecords && !this.newuserid) {
            return false;
        }

        return true;
    }

    public deactivate() {
        let modules = [];

        // define an empty body. If newuserid is set create the body
        let body: any = {};
        if (this.newuserid) {
            body.modules = [];
            for (let object of this.objects.filter(o => o.reassign)) {
                modules.push(object.sysmoduleid);
            }
            body.newuserid = this.newuserid;
        }

        // create apsinner for the user indicating the process and submit the request
        let spinner = this.modal.await(this.language.getLabel('LBL_DEACTIVATING'));
        this.backend.postRequest(`module/Users/${this.model.id}/deactivate`, {}, body).subscribe(
            res => {
                this.model.getData();
                spinner.emit(true);
                this.close();
            },
            err => {
                spinner.emit(true);
                this.toast.sendToast('an Error occured deactivating the User', 'error');
            }
        );
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}
