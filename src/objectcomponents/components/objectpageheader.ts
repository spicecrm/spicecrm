/**
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";

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
        public language: language,
        public router: Router,
        public model: model,
        public metadata: metadata,
        public modal: modal,
        public toast: toast
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
     * if true the deactivation icon is displayed
     */
    get isInactiveFieldProperty(): boolean {
        return this.model.data.hasOwnProperty('is_inactive');
    }

    /**
     * changes the icon
     * inactive: toggle_off
     * active: toggle_on
     */
    get manageIcon(): string {
        return this.model.data.is_inactive == '1' ? 'toggle_off' : 'toggle_on'
    }

    /**
     * changes the color of the deactivate icon
     *
     * inactive: error
     * active: default
     */
    get filterColorClass() {
        return this.model.data.is_inactive == '1' ? 'slds-icon-text-error' : 'slds-icon-text-default'
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

    /**
     * sets is_inactive flag on a Bean to true
     */
    public deactivateBean() {

        // do nothing if the bean is already inactive
        if(this.model.data.is_inactive == '1') return;

       if(!this.model.checkAccess('edit')) {
           this.toast.sendToast('MSG_NO_EDIT_RIGHTS', 'error');
           return;
       }

        this.modal.confirm('MSG_DEACTIVATE_RECORD', 'MSG_DEACTIVATE_RECORD')
            .subscribe(answer => {
                if (answer) {
                    this.model.setField('is_inactive', '1')
                    this.model.save(true);
                }
            });
    }

}
