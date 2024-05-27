/**
 * @module ObjectComponents
 */
import {Component, Injector, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {navigation} from "../../services/navigation.service";

@Component({
    selector: "object-action-new-button",
    templateUrl: "../templates/objectactionnewbutton.html",
    providers: [model]
})
export class ObjectActionNewButton implements OnInit {

    /**
     * set to true to disanble the button .. based on the ACL Check fdor the model
     */
    public disabled: boolean = true;

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    public navigation: navigation;

    public actionconfig: any;

    constructor(public language: language, public metadata: metadata, public model: model, @SkipSelf() public parentmodel: model, public injector: Injector) {

    }

    public execute() {
        if(this.actionconfig.newtab){
            this.addNewTab();
        } else {
            // make sure we have no idea so a new on gets issues
            this.model.module = this.parentmodel.module;
            this.model.id = undefined;
            this.model.initialize();
            this.model.addModel("", this.parentmodel);
        }
    }

    public ngOnInit() {
        if (this.parentmodel.module && this.metadata.checkModuleAcl(this.parentmodel.module, "create")) {
            this.disabled = false;
        }
    }


    /**
     * adds in a new tab
     *
     * @private
     */
    private addNewTab(){
        this.navigation = this.injector.get<navigation>(navigation);
        this.model.id = this.model.generateGuid();
        this.model.module = this.parentmodel.module;
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
