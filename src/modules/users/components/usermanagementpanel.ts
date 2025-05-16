/**
 * @module ModuleUsers
 */
import {Component, Injector, OnInit, SkipSelf} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * a panel to manage the user details from the parent item
 */
@Component({
    selector: 'user-management-panel',
    templateUrl: "../templates/usermanagementpanel.html",
    providers: [model]
})

export class UserManagementPanel implements OnInit{

    constructor(
        public modal: modal,
        public model: model,
        @SkipSelf() public parent: model,
        public metadata: metadata,
        public injector: Injector,
        public configuration: configurationService
    ) {
        this.model.module = 'Users';
    }

    public ngOnInit() {
        if(this.parent.getField('user_id')){
            this.model.id = this.parent.getField('user_id');
            this.model.getData();
        }
    }

}
