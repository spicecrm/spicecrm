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
    templateUrl: "./src/modules/acl/templates/acluserprofiles.html"
})
export class ACLUserProfiles {

    /**
     * the array with the profiles for the user
     */
    private userProfiles: any[] = [];

    /**
     * the id of the currently selected profile
     */
    private selectedProfileId: string = '';

    /**
     * the objects for the selected profile
     */
    private profileObjects: any[] = []

    constructor(
        private backend: backend,
        private toast: toast,
        private modal: modal,
        private model: model,
        private session: session,
        private language: language
    ) {
        // load the profiles for the user
        this.backend.getRequest("module/Users/" + this.model.id + "/related/spiceaclprofiles").subscribe(res => {
            this.userProfiles = res;
        });
    }

    private selectProfile(profileid) {
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
