/**
 * @module ModuleACL
 */
import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {session} from "../../../services/session.service";

/**
 * @ignore
 */
declare var _: any;

/**
 * rendered as part of the user profile to display the profiles assigned to the user
 */
@Component({
    templateUrl: "../templates/acluserprofiles.html"
})
export class ACLUserProfiles {

    /**
     * the array with the profiles for the user
     */
    public userProfiles: any[] = [];

    /**
     * the id of the currently selected profile
     */
    public selectedProfileId: string = '';

    /**
     * the objects for the selected profile
     */
    public profileObjects: any[] = []

    constructor(
        public backend: backend,
        public toast: toast,
        public modal: modal,
        public model: model,
        public session: session,
        public language: language
    ) {
        // load the profiles for the user
        this.backend.getRequest("module/Users/" + this.model.id + "/related/spiceaclprofiles").subscribe(res => {
            this.userProfiles = res;
        });
    }

    public selectProfile(profileid) {
        if (this.selectedProfileId != profileid) {
            this.selectedProfileId = profileid;
            this.profileObjects = [];
            this.backend.getRequest("module/SpiceACLProfiles/" + profileid + "/related/spiceaclobjects").subscribe(res => {
                for (let i in res) {
                    this.profileObjects.push(res[i]);
                }
            });
        }
    }

}
