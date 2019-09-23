/**
 * @module ObjectComponents
 */
import {
    Component, Input, OnInit,
} from '@angular/core';

import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';


/**
 * renders a modal window to show all possible modules(beans) which can be created after closing an activity
 */
@Component({
    templateUrl: './src/modules/activities/templates/activityclosecreatemodal.html',
    providers: [model]
})
export class ActivityCloseCreateModal implements OnInit {

    /**
     * the componentconfig that gets passed in when the modal is created
     */
    private componentconfig: any = {};

    /**
     * all modules where its possible to create new bean | STRING with ',' Seperator
     */
    private newBeanModules: any = [];

    /**
     * the parent bean we are cloning from
     */
    @Input() public parent: any = {};

    /**
     * a reference to the modal itself so the modal cann close itself
     */
    private self: any = {};
    private value: string = "";

    constructor(
        private language: language,
        private model: model,
        private metadata: metadata
    ) {

    }

    /**
     * Get the actionset-items; Get all possible modules/beans from the "module configuration" and save them into an array
     */
    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig(this.constructor.name, this.parent.module);

        let newBeanModulesString = this.componentconfig.newBeanModules;
        if(newBeanModulesString) {
            let newBeanModulesArray = newBeanModulesString.split(",");

            for (let item of newBeanModulesArray) {
                // check if the user can create
                if(this.metadata.checkModuleAcl(item, 'create')){
                    this.newBeanModules.push(this.metadata.getModuleDefs(item));
                }
            }
        }
    }

    /**
     * destroy the component
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     * Set the module of the new model; Opens modal for new bean; self destroy
     */
    private create() {
        this.model.module = this.value;
        this.model.addModel("", this.parent);
        this.self.destroy();
    }
}
