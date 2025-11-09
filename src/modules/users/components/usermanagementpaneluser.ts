/**
 * @module ModuleUsers
 */
import {Component, Injector, Input, OnInit, SkipSelf} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {view} from "../../../services/view.service";

/**
 * a panel to manage the user details from the parent item
 */
@Component({
    selector: 'user-management-panel-user',
    templateUrl: "../templates/usermanagementpaneluser.html",
    providers: [model, view],
    standalone: false
})

export class UserManagementPanelUser implements OnInit{

    /**
     * the componentconfig
     */
    public componentconfig: any;

    /**
     * the user data passed in
     */
    @Input() public userData: any = null;

    constructor(
        public model: model,
        public metadata: metadata,
        public view: view,
    ) {
        this.model.module = 'Users';
        this.view.isEditable = false;


    }

    get componentset(){
        return this.componentconfig.componentset;
    }

    public ngOnInit() {


        // initialize the model
        this.model.id = this.userData.id;
        this.model.initialize();
        this.model.setData(this.userData);


        this.componentconfig = this.metadata.getComponentConfig('UserManagementPanel', 'Users');
    }




}
