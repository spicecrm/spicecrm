/**
 * @module ModuleACL
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    Input,
    OnChanges
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'aclprofiles-manager-profile',
    templateUrl: './src/modules/acl/templates/aclprofilesmanagerprofile.html'
})
export class ACLProfilesManagerProfile implements OnChanges {

    @Input() private profile: any;
    @Input() private profileid: string = '';
    private loaded: boolean = false;
    private loadingobjects: boolean = false;
    private loadingusers: boolean = false;
    private activetab: string = 'profiles';

    private aclobjects: any[] = [];
    private aclusers: any[] = [];

    constructor(private modal: modal, private language: language, private backend: backend) {

    }

    get aclallusers() {
        let allusers = this.aclusers.filter(acluser => acluser.id == '*');
        return allusers.length > 0;
    }

    set aclallusers(value) {
        if (value) {
            this.backend.postRequest('module/SpiceACLProfiles/' + this.profileid + '/related/users', {}, {userids: ['*']}).subscribe(status => {
                this.aclusers.push({
                    id: '*',
                    user_name: ''
                });
            });
        } else {
            this.backend.deleteRequest('module/SpiceACLProfiles/' + this.profileid + '/related/users/*').subscribe(status => {
                let i = 0;
                for (let aclusers of this.aclusers) {
                    if (aclusers.id == '*') {
                        this.aclusers.splice(i, 1);
                    }
                    i++;
                }
            });
        }
    }

    public ngOnChanges() {
        this.loaded = false;
        if (this.profileid) {
            this.loadingobjects = true;
            this.aclobjects = [];
            this.loadingusers = true;
            this.aclusers = [];
            this.backend.getRequest('module/SpiceACLProfiles/' + this.profileid + '/related/spiceaclobjects').subscribe(aclobjects => {
                this.aclobjects = aclobjects;
                this.loadingobjects = false;
                this.sortobjects();
            });

            this.backend.getRequest('module/SpiceACLProfiles/' + this.profileid + '/related/users').subscribe(aclusers => {
                this.aclusers = aclusers;
                this.loadingusers = false;
                this.sortusers();
            });
        }
    }

    private selectProfile() {
        this.modal.openModal('ACLProfilesManagerAddObjectModal').subscribe(modalRef => {
            modalRef.instance.aclobject.subscribe(aclobject => {
                this.backend.postRequest('module/SpiceACLProfiles/' + this.profileid + '/related/spiceaclobjects/' + aclobject.id).subscribe(status => {
                    this.aclobjects.push(aclobject);
                    this.sortobjects();
                });
            });
        });
    }

    private removeProfile(objectId) {
        this.backend.deleteRequest('module/SpiceACLProfiles/' + this.profileid + '/related/spiceaclobjects/' + objectId).subscribe(status => {
            let i = 0;
            for (let aclobject of this.aclobjects) {
                if (aclobject.id == objectId) {
                    this.aclobjects.splice(i, 1);
                    return;
                }
                i++;
            }
        });
    }

    private save() {
        this.backend.save('SpiceACLProfiles', this.profileid, {
            name: this.profile.name,
            description: this.profile.description,
            for_portal_users: this.profile.for_portal_users
        });
    }

    private removeUser(userId) {
        this.backend.deleteRequest('module/SpiceACLProfiles/' + this.profileid + '/related/users/' + userId).subscribe(status => {
            let i = 0;
            for (let aclusers of this.aclusers) {
                if (aclusers.id == userId) {
                    this.aclusers.splice(i, 1);
                    return;
                }
                i++;
            }
        });
    }

    private selectUser() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'Users';
            selectModal.instance.multiselect = true;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    let newusers = [];
                    items.forEach(user => {
                        newusers.push(user.id);
                    });
                    this.backend.postRequest('module/SpiceACLProfiles/' + this.profileid + '/related/users', {}, {userids: newusers}).subscribe(status => {
                        items.forEach(user => {
                            this.aclusers.push({
                                id: user.id,
                                user_name: user.user_name
                            });
                        });
                        this.sortusers();
                    });

                }
            });
        });
    }

    private sortobjects() {
        this.aclobjects.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });
    }

    private sortusers() {
        this.aclusers.sort((a, b) => {
            if (a.id == '*') return -1;
            if (b.id == '*') return 1;

            return a.user_name > b.user_name ? 1 : -1;
        });
    }
}
