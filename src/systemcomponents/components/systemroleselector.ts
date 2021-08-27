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
