/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";

@Component({
    templateUrl: "./src/modules/users/templates/userdeactivatemodal.html"
})

export class UserDeactivateModal {

    /**
     * reference to the modal itself
     */
    private self: any;

    /**
     * all objects linked to the assigned user
     */
    private objects: any[] = [];

    /**
     * inidcator that we are loading elements for the user
     */
    private loading = true;

    /**
     * boolean to indicate that teh records shopudl be reassigned
     */
    private reassignRecords: boolean = true;

    /**
     * the userid to reassign the records to
     */
    private reassignUserId: string = '';

    /**
     * the name of the user to reassign the records to
     */
    private reassignUserName: string = '';

    constructor(private model: model, private backend: backend) {
        this.getUserObjects();
    }

    /**
     * get objects assigned to the current user
     */
    private getUserObjects() {
        this.backend.getRequest(`/module/Users/${this.model.id}/deactivate`).subscribe(
            res => {
                for(let moduleid in res){
                    this.objects.push({
                        sysmoduleid: moduleid,
                        count: parseInt(res[moduleid].totalcount, 10),
                        reassign: parseInt(res[moduleid].totalcount, 10) > 0
                    });
                }

                this.loading = false;
            },
            error => {
                this.loading = false;
            });
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

}
