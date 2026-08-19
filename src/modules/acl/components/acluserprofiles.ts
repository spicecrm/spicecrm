/**
 * @module ModuleACL
 */
import {Component, OnInit} from "@angular/core";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {session} from "../../../services/session.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

/**
 * @ignore
 */
declare var _: any;

/**
 * rendered as part of the user profile to display the profiles assigned to the user
 */
@Component({
    selector: 'acl-user-profiles',
    templateUrl: "../templates/acluserprofiles.html",
    providers: [relatedmodels],
    standalone: false
})
export class ACLUserProfiles implements OnInit{

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

    /**
     * enable adding new profiles
     */
    public enableAdd: boolean = false;

    constructor(
        public backend: backend,
        public toast: toast,
        public modal: modal,
        public model: model,
        public session: session,
        public language: language,
        public relatedmodels: relatedmodels
    ) {

    }

    public ngOnInit() {
        // set the basic params
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;

        // pass in the model
        this.relatedmodels.model = this.model;

        // set the related model
        this.relatedmodels.relatedModule = 'SpiceACLProfiles'

        // get the profiles
        this.getUserProfiles();
    }

    public getUserProfiles(){
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
                this.profileObjects = res;
            });
        }
    }

    /**
     * render a modal to select profiles
     */
    public selectNewProfiles(){
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'SpiceACLProfiles';
            selectModal.instance.multiselect = true;

            selectModal.instance.selectedItems.subscribe(items => {
                this.addProfiles(items);
            });
        });
    }

    /**
     * add profiles
     *
     * @param items
     */
    public addProfiles(items){
        this.relatedmodels.addItems(items).subscribe({
            next: () => {
                this.getUserProfiles();
            }
        });
    }

    /**
     * delete the profiles
     *
     * @param id
     */
    public deleteProfile(id){
        this.modal.prompt('confirm', 'MSG_DELETE_CONFIRM', 'LBL_DELETE_RECORD').subscribe({
            next: (a) => {
                if(a){
                    this.relatedmodels.deleteItem(id);
                    let index = this.userProfiles.findIndex(p => p.id == id);
                    this.userProfiles.splice(index, 1);

                    if(this.selectedProfileId == id) {
                        this.selectedProfileId = undefined;
                        this.profileObjects = [];
                    }
                }
            }
        })
    }

}
