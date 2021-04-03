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
    templateUrl: './src/modules/acl/templates/aclprofilesmanagerprofiles.html',
})
export class ACLProfilesManagerProfiles {

    private loading: boolean = false;
    private aclprofiles: any[] = [];
    private activeProfile: any = {};
    private activeProfileId: string = '';
    private searchterm: string = '';

    @Output() private profileselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.getProfiles();
    }

    private keyUp(_e) {
        switch (_e.key) {
            case 'Enter':
                this.getProfiles();
                break;
        }
    }

    private getProfiles() {
        this.loading = true;
        this.aclprofiles = [];

        // reset the selection
        this.activeProfileId = '';
        this.profileselected.emit(this.activeProfileId);

        let params = {fields: ['id', 'name', 'description', 'status'], searchterm: this.searchterm, limit: '-99'};

        this.backend.getRequest('module/SpiceACLProfiles', params).subscribe(aclprofiles => {
            this.aclprofiles = aclprofiles.list;

            // sort by name
            this.aclprofiles.sort((a, b) => a.name > b.name ? 1 : -1);

            this.loading = false;
        });
    }

    private addProfile() {
        this.modal.openModal('ACLProfilesManagerAddProfileModal').subscribe(modalRef => {

            modalRef.instance.newObjectData.subscribe(modelData => {
                if (modelData) {
                    this.aclprofiles.push(modelData);
                    this.selectProfile(modelData);
                }
            });
        });
    }

    private selectProfile(aclprofile) {
        this.activeProfile = aclprofile;
        this.activeProfileId = aclprofile.id;
        this.profileselected.emit(this.activeProfile);
    }

    private activateProfile(profileid) {
        this.backend.postRequest('module/SpiceACLProfiles/' + profileid + '/activation').subscribe(aclobjects => {
            this.aclprofiles.some(profile => {
                if (profile.id == profileid) {
                    profile.status = 'r';
                    return true;
                }
            });
        });
    }

    private deactivateProfile(profileid) {
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
