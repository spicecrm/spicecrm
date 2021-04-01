/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
            this.backend.postRequest('spiceaclprofiles/' + this.profileid + '/aclusers', {}, {userids: ['*']}).subscribe(status => {
                this.aclusers.push({
                    id: '*',
                    user_name: ''
                });
            });
        } else {
            this.backend.deleteRequest('spiceaclprofiles/' + this.profileid + '/aclusers/*').subscribe(status => {
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
            this.backend.getRequest('spiceaclprofiles/' + this.profileid + '/aclobjects').subscribe(aclobjects => {
                this.aclobjects = aclobjects;
                this.loadingobjects = false;
                this.sortobjects();
            });

            this.backend.getRequest('spiceaclprofiles/' + this.profileid + '/aclusers').subscribe(aclusers => {
                this.aclusers = aclusers;
                this.loadingusers = false;
                this.sortusers();
            });
        }
    }

    private selectProfile() {
        this.modal.openModal('ACLProfilesManagerAddObjectModal').subscribe(modalRef => {
            modalRef.instance.aclobject.subscribe(aclobject => {
                this.backend.postRequest('spiceaclprofiles/' + this.profileid + '/aclobjects/' + aclobject.id).subscribe(status => {
                    this.aclobjects.push(aclobject);
                    this.sortobjects();
                });
            });
        });
    }

    private removeProfile(objectId) {
        this.backend.deleteRequest('spiceaclprofiles/' + this.profileid + '/aclobjects/' + objectId).subscribe(status => {
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
            description: this.profile.description
        });
    }

    private removeUser(userId) {
        this.backend.deleteRequest('spiceaclprofiles/' + this.profileid + '/aclusers/' + userId).subscribe(status => {
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
                    this.backend.postRequest('spiceaclprofiles/' + this.profileid + '/aclusers', {}, {userids: newusers}).subscribe(status => {
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
