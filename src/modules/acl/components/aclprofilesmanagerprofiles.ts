/**
 * @module ModuleACL
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';

@Component({
    selector: 'aclprofiles-manager-profiles',
    templateUrl: '../templates/aclprofilesmanagerprofiles.html',
})
export class ACLProfilesManagerProfiles {

    public loading: boolean = false;
    public aclprofiles: any[] = [];
    public activeProfile: any = {};
    public activeProfileId: string = '';
    public searchterm: string = '';

    @Output() public profileselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend, public modal: modal, public language: language, public modelutilities: modelutilities) {
        this.getProfiles();
    }

    public keyUp(_e) {
        switch (_e.key) {
            case 'Enter':
                this.getProfiles();
                break;
        }
    }

    public getProfiles() {
        this.loading = true;
        this.aclprofiles = [];

        // reset the selection
        this.activeProfileId = '';
        this.profileselected.emit(this.activeProfileId);

        let params = {fields: ['id', 'name', 'description', 'status', 'for_portal_users'], searchterm: this.searchterm, limit: '-99'};

        this.backend.getRequest('module/SpiceACLProfiles', params).subscribe(aclprofiles => {
            this.aclprofiles = aclprofiles.list;

            // sort by name
            this.aclprofiles.sort((a, b) => a.name > b.name ? 1 : -1);

            this.aclprofiles.forEach( profile => {
                if( profile.hasOwnProperty( 'for_portal_users' ) ) {
                    profile.for_portal_users = this.modelutilities.backend2spice( "SpiceACLProfiles", 'for_portal_users', profile.for_portal_users );
                }
            });

            this.loading = false;
        });
    }

    public addProfile() {
        this.modal.openModal('ACLProfilesManagerAddProfileModal').subscribe(modalRef => {

            modalRef.instance.newObjectData.subscribe(modelData => {
                if (modelData) {
                    this.aclprofiles.push(modelData);
                    this.selectProfile(modelData);
                }
            });
        });
    }

    public selectProfile(aclprofile) {
        this.activeProfile = aclprofile;
        this.activeProfileId = aclprofile.id;
        this.profileselected.emit(this.activeProfile);
    }

    public activateProfile(profileid) {
        this.backend.postRequest('module/SpiceACLProfiles/' + profileid + '/activation').subscribe(aclobjects => {
            this.aclprofiles.some(profile => {
                if (profile.id == profileid) {
                    profile.status = 'r';
                    return true;
                }
            });
        });
    }

    public deactivateProfile(profileid) {
        this.backend.deleteRequest('module/SpiceACLProfiles/' + profileid + '/activation').subscribe(aclobjects => {
            this.aclprofiles.some(profile => {
                if (profile.id == profileid) {
                    profile.status = 'd';
                    return true;
                }
            });
        });
    }
}
