/*
SpiceUI 2021.01.001

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
        this.backend.postRequest('spiceaclprofiles/' + profileid + '/activate').subscribe(aclobjects => {
            this.aclprofiles.some(profile => {
                if (profile.id == profileid) {
                    profile.status = 'r';
                    return true;
                }
            });
        });
    }

    private deactivateProfile(profileid) {
        this.backend.postRequest('spiceaclprofiles/' + profileid + '/deactivate').subscribe(aclobjects => {
            this.aclprofiles.some(profile => {
                if (profile.id == profileid) {
                    profile.status = 'd';
                    return true;
                }
            });
        });
    }
}
