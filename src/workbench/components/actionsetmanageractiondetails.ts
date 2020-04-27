/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';


@Component({
    selector: 'actionsetmanager-action-details',
    templateUrl: './src/workbench/templates/actionsetmanageractiondetails.html',
    providers: [view]
})
export class ActionsetManagerActionDetails implements OnChanges {

    @Input() public action: any = {};

    private component: string = "";
    private component_backup: string = "";
    private localcomponent: string = "";

    private systemmodule: string = '';
    private systemmodules: any[] = [];

    // all standard actions! hardcoded :(
    private standardActions = [
        {display: "NEW", value: "NEW", component: "ObjectActionNewButton"},
        {display: "DUPLICATE", value: "DUPLICATE", component: "ObjectActionDuplicateButton"},
        {display: "NEWRELATED", value: "NEWRELATED", component: "ObjectActionNewrelatedButton"},
        {display: "EDIT", value: "EDIT", component: "ObjectActionEditButton"},
        {display: "DELETE", value: "DELETE", component: "ObjectActionDeleteButton"},
        {display: "AUDIT", value: "AUDIT", component: "ObjectActionAuditlogButton"},
        {display: "IMPORT", value: "IMPORT", component: "SpiceImporterImportButton"},
        {display: "MAIL", value: "MAIL", component: "ObjectActionBeanToMailButton"},
        {display: "PRINT", value: "PRINT", component: "ObjectActionOutputBeanButton"},
        {display: "ROUTE", value: "ROUTE", component: "GlobalNavigationMenuItemActionRoute"},
        {display: "SELECT", value: "SELECT", component: "ObjectActionSelectButton"},
        {display: "OPEN", value: "OPEN", component: "ObjectActionOpenButton"},
        {display: "CANCEL", value: "CANCEL", component: "ObjectActionCancelButton"},
        {display: "SAVE", value: "SAVE", component: "ObjectActionSaveButton"},
        {display: "SAVERELATED", value: "SAVERELATED", component: "ObjectActionSaveRelatedButton"}
    ];

    constructor(private backend: backend, private metadata: metadata, private language: language, private view: view) {
        // get all system-modules
        this.systemmodules = this.metadata.getSystemModules();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if(this.action) {
            if (this.action.isViewMode) {
                this.view.setViewMode();
            } else {
                this.view.setEditMode();
            }
            this.localcomponent = this.action.component;

            // backup for the component which is selected
            this.component_backup = this.localcomponent;
            this.setActionComponent();
        }
    }

    // get all system-components for the selected system-module
    get components() {
        return this.metadata.getSystemComponents(this.systemmodule);
    }

    // get the component-name with the deprecated info
    private componentName(component) {
        if(component) {
            if(component.deprecated == '1') {
                return component.component + ' | dep.';
            } else {
                return component.component;
            }
        }
        return '';
    }

    // function which is called by changing standard-action
    private setActionComponent() {
        if(this.action.action) {
            this.localcomponent = this.standardActions.find( action => action.value === this.action.action ).component;
        } else {
            this.localcomponent = this.component_backup;
        }
        // this.action.name = this.action.action ? this.action.action: this.action.component;
        this.systemmodule = this.metadata.getSystemModuleByComponent(this.localcomponent);
    }
// function which is called by changing component
    private setComponent() {
        this.action.component = this.localcomponent;
    }
}
