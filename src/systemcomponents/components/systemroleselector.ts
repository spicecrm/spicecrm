/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {broadcast} from "../../services/broadcast.service";
import {userpreferences} from "../../services/userpreferences.service";

declare var _: any;

@Component({
    selector: "system-role-selector",
    templateUrl: "../templates/systemroleselector.html"
})
export class SystemRoleSelector implements OnInit {

    /**
     * the available languages
     */
    public roles: any[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public broadcast: broadcast,
        public userpreferences: userpreferences
    ) {
    }

    public ngOnInit(): void {
        this.getRoles();
    }

    /**
     * fecthes the available roles for the user
     */
    public getRoles() {
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
    public setActiveRole(roleid){
        this.metadata.setActiveRole(roleid);

        // set the role to the preferences
        this.userpreferences.setPreference('userrole', roleid)

        // navigate home and broadcast the message
        this.broadcast.broadcastMessage('applauncher.setrole', roleid);
    }

}
