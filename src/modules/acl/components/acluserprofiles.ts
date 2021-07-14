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
