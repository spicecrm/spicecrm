/**
 * @module ModuleACL
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    Input,
    OnChanges, ChangeDetectorRef
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'aclprofiles-manager-profile',
    templateUrl: '../templates/aclprofilesmanagerprofile.html'
})
export class ACLProfilesManagerProfile implements OnChanges {

    @Input() public profile: any;
    @Input() public profileid: string = '';
    public loaded: boolean = false;
    public loadingobjects: boolean = false;
    public loadingusers: boolean = false;
    public loadingorgunits: boolean = false;
    public _activetab: 'profiles'|'users'|'orgunits'|'details' = 'profiles';

    public aclobjects: any[] = [];
    public aclusers: any[] = [];
    public aclorgunits: any[] = [];

    constructor(
        public modal: modal,
        public language: language,
        public backend: backend,
        private cdref: ChangeDetectorRef
    ) {

    }

    get activetab(){
        return this._activetab;
    }

    set activetab(tab: "profiles" | "users" | "orgunits" | "details"){
        this._activetab = tab;
        this.cdref.detectChanges();
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
            this.loadingorgunits = true;
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

            this.backend.getRequest('module/SpiceACLProfiles/' + this.profileid + '/related/orgunits').subscribe(aclorgunits => {
                this.aclorgunits = aclorgunits;
                this.loadingorgunits = false;
                this.sortorgunits();
            });
        }
    }

    public selectProfile() {
        this.modal.openModal('ACLProfilesManagerAddObjectModal').subscribe(modalRef => {
            modalRef.instance.aclobject.subscribe(aclobject => {
                this.backend.postRequest('module/SpiceACLProfiles/' + this.profileid + '/related/spiceaclobjects/' + aclobject.id).subscribe(status => {
                    this.aclobjects.push(aclobject);
                    this.sortobjects();
                });
            });
        });
    }

    public removeProfile(objectId) {
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

    public save() {
        this.backend.save('SpiceACLProfiles', this.profileid, {
            name: this.profile.name,
            description: this.profile.description,
            for_portal_users: this.profile.for_portal_users
        });
    }

    public removeUser(userId, e: MouseEvent) {
        e.stopPropagation(); e.preventDefault()
        this.backend.deleteRequest('module/SpiceACLProfiles/' + this.profileid + '/related/users/' + userId).subscribe(status => {
            let i = this.aclusers.findIndex(u => u.id == userId);
            this.aclusers.splice(i, 1);
        });
    }

    public removeOrgUnit(orgunitid, e: MouseEvent) {
        e.stopPropagation(); e.preventDefault()
        this.backend.deleteRequest('module/SpiceACLProfiles/' + this.profileid + '/related/orgunit/' + orgunitid).subscribe(status => {
            let i = this.aclorgunits.findIndex(o => o.id == orgunitid);
            this.aclorgunits.splice(i, 1);
        });
    }

    public selectUser() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'Users';
            selectModal.instance.multiselect = true;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    let newusers = [];
                    items.forEach(user => {
                        // check that the user is not already allocated
                        if(this.aclusers.findIndex(u => u.id == user.id) == -1) {
                            newusers.push(user.id);
                        }
                    });

                    // check that we have users to add
                    if(newusers.length > 0) {
                        this.backend.postRequest('module/SpiceACLProfiles/' + this.profileid + '/related/users', {}, {userids: newusers}).subscribe(status => {
                            items.forEach(user => {
                                if(this.aclusers.findIndex(u => u.id == user.id) == -1) {
                                    this.aclusers.push({
                                        id: user.id,
                                        user_name: user.user_name
                                    });
                                }
                            });
                            this.sortusers();
                        });
                    }

                }
            });
        });
    }

    /**
     * renders a select modal for the orgunits
     */
    public selectOrgUnit() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'OrgUnits';
            selectModal.instance.multiselect = true;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    let neworgunits = [];
                    items.forEach(o => {
                        // check that we do not yet already have it allocated
                        if(this.aclorgunits.findIndex(to => to.id == o.id) < 0) {
                            neworgunits.push(o.id);
                        }
                    });

                    // if we have new ones add them
                    if(neworgunits.length > 0) {
                        this.backend.postRequest('module/SpiceACLProfiles/' + this.profileid + '/related/orgunits', {}, {orgunitids: neworgunits}).subscribe(status => {
                            items.forEach(o => {
                                if(this.aclorgunits.findIndex(to => to.id == o.id) < 0) {
                                    this.aclorgunits.push({
                                        id: o.id,
                                        name: o.name
                                    });
                                }
                            });
                            this.sortusers();
                            this.sortorgunits();
                        });
                    }

                }
            });
        });
    }

    public sortobjects() {
        this.aclobjects.sort((a, b) => {
            if(a.module == b.module) {
                return a.name.localeCompare(b.name);
            } else {
                return a.module.localeCompare(b.module);
            }
        });
    }

    /**
     * sorts the usernames
     */
    public sortusers() {
        this.aclusers.sort((a, b) => {
            if (a.id == '*') return -1;
            if (b.id == '*') return 1;

            return a.user_name.localeCompare(b.user_name);
        });
    }

    /**
     * sorts the orgunits
     */
    public sortorgunits() {
        this.aclorgunits.sort((a, b) =>  a.name.localeCompare(b.name));
    }
}
