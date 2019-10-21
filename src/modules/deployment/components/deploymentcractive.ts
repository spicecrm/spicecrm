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
