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
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {broadcast} from "../../services/broadcast.service";

declare var _: any;

@Component({
    selector: "system-role-selector",
    templateUrl: "./src/systemcomponents/templates/systemroleselector.html"
})
export class SystemRoleSelector implements OnInit {

    /**
     * the available languages
     */
    private roles: any[] = [];

    constructor(private language: language, private metadata: metadata, private broadcast: broadcast) {
    }

    public ngOnInit(): void {
        this.getRoles();
    }

    /**
     * fecthes the available roles for the user
     */
    private getRoles() {
        this.roles = this.metadata.getRoles();
    }

    /**
     * returns the active role
     */
    get activeRole() {
        return this.metadata.getActiveRole();
    }

    /**
     * sets the new role as active role
     *
     * @param role
     */
    private setActiveRole(roleid){
        this.metadata.setActiveRole(roleid);

        // navigate home and broadcast the message
        this.broadcast.broadcastMessage('applauncher.setrole', roleid);
    }

}
