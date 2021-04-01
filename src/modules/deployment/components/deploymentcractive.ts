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
 * @module ModuleDeployment
 */
import {Component, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {broadcast} from "../../../services/broadcast.service";
import {session} from "../../../services/session.service";

/**
 * renders a componentn in the global toolbar on top to display if a cr is active
 */
@Component({
    templateUrl: "./src/modules/deployment/templates/deploymentcractive.html"
})
export class DeploymentCRActive implements OnDestroy {

    /**
     * the active id
     */
    private activeID = "";

    /**
     * the active name
     */
    private activeName = "";

    /**
     * a subscription handler for the global broadcast message service to catchj if the active CR changes
     */
    private broadcastsubscription: any = null;

    constructor(private language: language,
                private backend: backend,
                private session: session,
                private broadcast: broadcast,
                private router: Router) {

        // get from the backend if a CR is active currently
        this.backend.getRequest("systemdeploymentcrs/active").subscribe(crresponse => {
            this.activeID = crresponse.id;
            this.activeName = crresponse.name;
        });

        // subscribe to the broadcast message
        this.broadcastsubscription = this.broadcast.message$.subscribe(message => {
            if (message.messagedata.module !== "SystemDeploymentCRs") {
                return;
            }

            switch (message.messagetype) {
                case "cr.setactive":
                    this.activeID = message.messagedata.id;
                    this.activeName = message.messagedata.name;
                    break;
                case "cr.clearactive":
                    this.activeID = '';
                    this.activeName = '';
                    break;
                case "model.save":
                    if (message.messagedata.id === this.activeID) {
                        this.activeID = message.messagedata.id;
                        this.activeName = message.messagedata.data.name;
                    }
                    break;
                case "model.delete":
                    if (message.messagedata.id === this.activeID) {
                        this.activeID = "";
                        this.activeName = "";
                    }
                    break;
            }
        });
    }

    /**
     * simple getter for the CR Name
     */
    get crName() {
        return this.activeName != "" ? this.activeName : "";
    }

    /**
     * checks if the user is an admin.
     *
     * This compoonent is for admins only at this stage
     */
    get isAdmin() {
        return this.session.isAdmin;
    }

    /**
     * unsubscribe if the component is destroyed
     */
    public ngOnDestroy() {
        this.broadcastsubscription.unsubscribe();
    }

    /**
     * navigates to the CR or the list of CRs
     */
    private goCR() {
        this.router.navigate(["/module/SystemDeploymentCRs" + (this.activeID ? "/" + this.activeID : "")]);
    }
}
