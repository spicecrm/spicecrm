/**
 * @module ObjectComponents
 */
import {Component, Injector, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {language} from "../../services/language.service";
import {navigation} from "../../services/navigation.service";
import {navigationtab} from "../../services/navigationtab.service";

@Component({
    selector: "object-action-newrelated-button",
    templateUrl: "../templates/objectactionnewbutton.html",
    providers: [model]
})
export class ObjectActionNewrelatedButton implements OnInit {

    public disabled: boolean = true;

    public actionconfig: {required_model_state?: string, newtab?: boolean};
    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    /**
     * the navigation service
     */
    public navigation: navigation;
    public navigationtab: navigationtab;

    constructor(@SkipSelf() public parent: model, public language: language, public metadata: metadata, public model: model, public relatedmodels: relatedmodels, public injector: Injector) {

    }

    public ngOnInit() {
        this.model.module = this.relatedmodels.relatedModule;
        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create") && (!this.actionconfig?.required_model_state || this.model.checkModelState(this.actionconfig.required_model_state))) {
            this.disabled = false;
        }
    }

    public execute() {

        if (!this.parent.getField('id')) {
            this.parent.setField('id', this.parent.id);
        }

        if(this.actionconfig.newtab) {
            this.addNewTab();
        } else {
            // make sure we have no id so a new on gets issues
            this.model.id = "";

            // add the model
            this.model.addModel("", this.parent).subscribe(response => {
                if (response != false) {
                    this.relatedmodels.addItems([response]);
                }
            });
        }
    }


    /**
     * adds in a new tab
     *
     * @private
     */
    private addNewTab(){
        this.navigation = this.injector.get<navigation>(navigation);
        this.navigationtab = this.injector.get<navigationtab>(navigationtab);
        this.model.id = this.model.generateGuid();
        this.model.initialize(this.parent);
        this.navigation.addObjectTab({
            path: 'module/:module/create/:id',
            params: {module: this.model.module, id: this.model.id},
            parentid: this.navigationtab ? this.navigationtab.tabid : undefined,
            id: this.model.generateGuid(),
            active: true,
            pinned: false,
            enablesubtabs: false,
            url: `module/${this.model.module}/create/${this.model.id}`,
            tabdata: {
                module: this.model.module,
                id: this.model.id,
                data: this.model.data
            }
        })
    }

}
