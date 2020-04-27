/**
 * @module ModuleReportsDesigner
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {Observable, Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

/**
 * renders a selection dialog for the list of modules and also in case of a new report the name
 */
@Component({
    selector: 'reports-designer-select-module-modal',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerselectmodulemodal.html',
})
export class ReportsDesignerSelectModuleModal implements OnInit {

    /**
     *
     */
    @Input() public createmode: boolean = false;

    /**
     * the list of modules, retrieved on Init and then potentially filtered
     */
    protected moduleList: any[] = [];

    /**
     * the filtered module list
     */
    protected filteredModuleList: any[] = [];


    private subject: Subject<any> = new Subject<any>();
    /**
     * @observable response: {name: string, module: string}
     */
    public response: Observable<any> = this.subject.asObservable();

    /**
     * reference to self as the widnwo to enable the modal to close itself
     */
    private self: any = {};

    /**
     * the name of the report
     */
    private reportName: string = '';

    /**
     * the selected module
     */
    private selectedModule: string = '';

    /**
     * the search term held internally
     */
    private _searchTerm: string = '';

    /**
     * the fieldset from the config to be rendered
     */
    private fieldset: string;

    constructor(private language: language, private metadata: metadata, private model: model, private view: view) {

        // set the view to editable and set the name field as default focus field
        this.view.isEditable = true;
        this.view.setEditMode();
        this.view.editfieldname = 'name';
    }


    /**
     * the getter for the searchterm
     */
    get searchTerm() {
        return this._searchTerm;
    }

    /**
     * set searchTerm and reassign the filteredModuleList
     * @param value: string
     */
    set searchTerm(value) {
        this.filteredModuleList = this.moduleList.filter(item => item.display.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
    }

    /**
     * @return disabled: boolean
     */
    get disabled() {
        return !(!!this.reportName && !!this.selectedModule);
    }

    public ngOnInit() {
        // get the list of modules
        this.loadModuleList();

        // load the component conf
        let componentConf = this.metadata.getComponentConfig('ReportsDesignerSelectModuleModal', this.model.module);
        this.fieldset = componentConf.fieldset;
    }

    /**
     * get modules from metadata and filter them
     */
    private loadModuleList() {
        this.moduleList = this.metadata.getModules()
            .map(module => ({name: module, display: this.language.getModuleName(module)}))
            .sort((a, b) => a.display > b.display ? 1 : -1);

        this.filteredModuleList = this.moduleList;
    }

    /**
     * set module value
     * @param module: string
     */
    private setSelectedModule(module) {
        this.selectedModule = module;
        if (!this.createmode) {
            this.confirm();
        }
    }

    /**
     * destroy the modal
     */
    private close() {
        this.subject.next(false);
        this.subject.complete();
        this.self.destroy();
    }


    /**
     * submit values and close the modal. Tis can also add the module name in case of a dblclick
     *
     * @param module
     */
    private confirm(module?) {
        if (module) {
            this.setSelectedModule(module);
        }
        if (this.canCreate) {
            this.subject.next({
                name: this.reportName,
                module: this.selectedModule
            });
            this.subject.complete();
            this.close();
        }
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item
     */
    private trackByFn(index, item) {
        return item;
    }

    /**
     * a getter that checks if the report can be create ot the module can be added
     */
    get canCreate() {
        return !this.createmode || this.model.getField('name')?.length > 0;
    }
}
