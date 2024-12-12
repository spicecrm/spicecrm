import {Component, ComponentRef, Injector, OnInit} from '@angular/core';
import {ActionSetItemI} from "../../../objectcomponents/interfaces/objectcomponents.interfaces";
import {modal} from "../../../services/modal.service";
import {UserAliasManagerModal} from "./useraliasmanagermodal";
import {session} from "../../../services/session.service";

@Component({
    selector: 'user-alias-manager-button',
    templateUrl: '../templates/useraliasmanagerbutton.html'
})

export class UserAliasManagerButton implements ActionSetItemI, OnInit {
    /**
     * holds the action config
     */
    public actionconfig;
    /**
     * disabled flag
     */
    public disabled: boolean = false;
    /**
     * hidden flag
     */
    public hidden: boolean = false;
    /**
     * reference of this component
     */
    public self: ComponentRef<this>;

    constructor(private modal: modal, private injector: Injector, private session: session) {
    }

    public ngOnInit() {
        if (!this.session.isAdmin) {
            this.hidden = true;
        }
    }

    /**
     * open the alias manager modal
     */
    public execute(): void {
        this.modal.openStaticModal(UserAliasManagerModal, true, this.injector);
    }
}