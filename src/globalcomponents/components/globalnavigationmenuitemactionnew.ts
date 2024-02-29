/**
 * @module GlobalComponents
 */
import {
    Component,
    OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {navigation} from "../../services/navigation.service";
import {navigationtab} from "../../services/navigationtab.service";

@Component({
    selector: 'global-navigation-menu-item-action-new',
    templateUrl: '../templates/globalnavigationmenuitemactionnew.html'
})
export class GlobalNavigationMenuItemActionNew implements OnInit {

    /**
     * per default disabled ... check against ACL on init
     */
    public disabled: boolean = true;

    /**
     * gets the aciton config from the action set
     */
    public actionconfig: any;

    constructor(public language: language, public model: model, public metadata: metadata, public navigation: navigation) {
    }

    /**
     * executes the click on teh button
     */
    public execute() {
        if(this.actionconfig.newtab){
            this.addNewTab();
        } else {
            this.model.id = '';
            this.model.addModel();
        }
    }

    /**
     * check if the user has create rights
     */
    public ngOnInit() {
        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create")) {
            this.disabled = false;
        }
    }

    /**
     * adds in a new tab
     *
     * @private
     */
    private addNewTab(){
        this.model.id = this.model.generateGuid();
        this.navigation.addObjectTab({
            path: 'module/:module/create/:id',
            params: {module: this.model.module, id: this.model.id},
            id: this.model.generateGuid(),
            active: true,
            pinned: false,
            enablesubtabs: false,
            url: `module/${this.model.module}/create/${this.model.id}`,
            tabdata: {
                module: this.model.module,
                id: this.model.id
            }
        })
    }
}
