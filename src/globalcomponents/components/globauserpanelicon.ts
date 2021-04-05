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
 * @module GlobalComponents
 */
import {Component} from "@angular/core";
import {session} from "../../services/session.service";
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";

/**
 * displays the gluoab user panel icon that also allows editing of the image by the user
 */
@Component({
    selector: "global-user-panel-icon",
    templateUrl: "./src/globalcomponents/templates/globaluserpanelicon.html",
})
export class GlobaUserPanelIcon {

    /**
     * transition if the edit icon is shown
     */
    private showEdit: boolean = false;

    constructor(
        private session: session,
        private modalservice: modal,
        private backend: backend
    ) {

    }

    /**
     * renders the upload modal to allow the user to change the image
     */
    private changeImage() {
        this.modalservice.openModal("SystemUploadImage").subscribe(componentref => {
            componentref.instance.cropheight = 150;
            componentref.instance.cropwidth = 150;
            componentref.instance.imagedata.subscribe(image => {
                if (image !== false) {
                    // make a backup of the image, set it to emtpy and if case call fails set back the saved image
                    let imagebackup = this.session.authData.userimage;
                    this.session.authData.userimage = '';
                    this.backend.postRequest('module/Users/' + this.session.authData.userId + '/image', {}, {imagedata: image}).subscribe(
                        response => {
                            this.session.authData.userimage = image;
                        },
                        error => {
                            this.session.authData.userimage = imagebackup;
                        });
                }
            });
        });
    }

    /**
     * returns the style with the opacity for the layover
     */
    get editstyle() {
        return {
            opacity: this.showEdit ? 1 : 0
        };
    }

    /**
     * returns the userimage from the session if the user has one maintained
     */
    get userimage() {
        return this.session.authData.userimage;
    }

    /**
     * registers the mouse enter and sets the edit show to true
     */
    private onMouseEnter() {
        this.showEdit = true;
    }

    /**
     * registers the mouse leave and sets the edit show to false
     */
    private onMouseLeave() {
        this.showEdit = false;
    }
}
