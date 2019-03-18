/**
 * @module ModuleDeployment
 */
import {Component, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {broadcast} from "../../../services/broadcast.service";
import {session} from "../../../services/session.service";

@Component({
    templateUrl: "./src/modules/deployment/templates/deploymentcractive.html",
    host: {
        "[style.display]": "getDisplay()"
    },
})
export class DeploymentCRActive implements OnDestroy {

    private activeID = "";
    private activeName = "";
    private broadcastsubscription: any = null;

    constructor(private language: language,
                private backend: backend,
                private session: session,
                private broadcast: broadcast,
                private router: Router) {
        this.backend.getRequest("systemdeploymentcrs/active").subscribe(crresponse => {
            this.activeID = crresponse.id;
            this.activeName = crresponse.name;
        });

        this.broadcastsubscription = this.broadcast.message$.subscribe(message => {
            if (message.messagedata.module !== "SystemDeploymentCRs") {
                return;
            }

            switch (message.messagetype) {
                case "cr.setactive":
                    this.activeID = message.messagedata.id;
                    this.activeName = message.messagedata.name;
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

    get crName() {
        return this.activeName != "" ? this.activeName : "-none-";
    }

    get isAdmin() {
        return this.session.isAdmin;
    }

    public ngOnDestroy() {
        this.broadcastsubscription.unsubscribe();
    }


    private getDisplay() {
        return this.isAdmin ? "inherit" : "none";
    }

    private goCR() {
        this.router.navigate(["/module/SystemDeploymentCRs" + (this.activeID ? "/" + this.activeID : "")]);
    }
}
