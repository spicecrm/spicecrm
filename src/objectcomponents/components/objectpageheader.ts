/**
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'object-page-header',
    templateUrl: '../templates/objectpageheader.html',
    providers: [view]
})
export class ObjectPageHeader implements OnInit {

    /**
     * holds component configuration
     */
    public componentconfig: any = {};

    /**
     * actionset id
     */
    public actionSet: string = '';

    /**
     * fieldset id
     */
    public fieldset: string = '';

    constructor(
        public router: Router,
        public model: model,
        public metadata: metadata
    ) {
    }

    public ngOnInit() {
        // get the Componentconfig if not set yet
        let componentconfig = this.componentconfig && !_.isEmpty(this.componentconfig) ? this.componentconfig : this.metadata.getComponentConfig('ObjectPageHeader', this.model.module);

        // set the actionset & fiedset
        this.actionSet = componentconfig.actionset;
        this.fieldset = componentconfig.fieldset;
    }

    get moduleName() {
        return this.model.module;
    }

    /**
     * checks if the field "is_inactive" exists on the Bean
     * if true the ObjectSetInactiveIcon is displayed
     */
    get hasInactiveFieldProperty(): boolean {
        return this.metadata.hasField(this.model._module, 'is_inactive');
    }

    /**
     * checks that the user can navigate to the module
     */
    get canGoToModule() {
        return this.metadata.getModuleDefs(this.moduleName).visible && this.metadata.checkModuleAcl(this.moduleName, 'list');
    }

    /**
     * opens the regular list view
     */
    public goToModule() {
        if (this.canGoToModule) {
            this.router.navigate(['/module/' + this.moduleName]);
        }
    }

}
