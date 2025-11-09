/**
 * @module ModuleUsers
 */
import {Component, Injector, OnDestroy, OnInit, SkipSelf} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {view} from "../../../services/view.service";
import {Subscription} from "rxjs";

/**
 * a panel to manage the user details from the parent item
 */
@Component({
    selector: 'user-management-panel',
    templateUrl: "../templates/usermanagementpanel.html",

    standalone: false
})

export class UserManagementPanel implements OnInit, OnDestroy{

    /**
     * the componentconfig
     */
    public componentconfig: any;

    /**
     * initialized indicator
     */
    public initialized: boolean = false;

    /**
     * the user data
     */
    public userData: any = null;

    public subscriptions: Subscription = new Subscription();

    constructor(
        public modal: modal,
        public model: model,
        public injector: Injector,
        public backend: backend,
        public metadata: metadata,
    ) {

    }

    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig('UserManagementPanel', 'Users');

        this.loadUserData();
    }

    private loadUserData(){
        this.backend.getRequest(`module/Users/byparent/${this.model.module}/${this.model.id}`).subscribe({
            next: (user) => {
                // set the user data
                this.userData = user;

                this.initialized = true;
            },
            error: (e) => {
                this.initialized = true;
            }
        })
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public addUser(){
        this.modal.openModal("UserAddModal", true, this.injector).subscribe({
            next: (modalref) => {
                if(this.componentconfig.profilefieldset){
                    modalref.instance.profileFieldset = this.componentconfig.profilefieldset;
                    modalref.instance.hideGotoDetailButton = true;
                        this.subscriptions.add(
                        modalref.instance.response.subscribe({
                            next: (res) => {
                                this.loadUserData();
                            }
                        })
                    );
                }
            }
        });
    }
}
