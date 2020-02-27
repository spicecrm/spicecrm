/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {Observable, Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'reports-designer-select-module-modal',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerselectmodulemodal.html',
})
export class ReportsDesignerSelectModuleModal {

    protected moduleList: any[] = [];
    protected filteredModuleList: any[] = [];
    private subject: Subject<any> = new Subject<any>();
    /**
     * @observable response: {name: string, module: string}
     */
    public response: Observable<any> = this.subject.asObservable();
    private self: any = {};
    private reportName: string = '';
    private selectedModule: string = '';

    constructor(private language: language, private metadata: metadata) {
    }

    private _searchTerm: string = '';

    get searchTerm() {
        return this._searchTerm;
    }

    /**
     * set searchTerm and reassign the filteredModuleList
     * @param value: string
     */
    set searchTerm(value) {
        this.filteredModuleList = this.moduleList.filter(item => item.toLowerCase().indexOf(value.toLowerCase()) > -1);
    }

    /**
     * @return disabled: boolean
     */
    get disabled() {
        return !(!!this.reportName && !!this.selectedModule);
    }

    public ngOnInit() {
        this.loadModuleList();
    }

    /**
     * get modules from metadata and filter them
     */
    private loadModuleList() {
        this.moduleList = this.metadata.getModules()
            .filter(module => {
                const moduleData = this.metadata.getModuleDefs(module);
                return !!moduleData.visible && (!moduleData.visibleaclaction ||
                    (!!moduleData.visibleaclaction && this.metadata.checkModuleAcl(module, moduleData.visibleaclaction))) &&
                    this.metadata.checkModuleAcl(module, 'list') && !!this.language.getModuleName(module);
            })
            .map(module => ({name: module, display: this.language.getModuleName(module)}))
            .sort();

        this.filteredModuleList = this.moduleList;
    }

    /**
     * set module value
     * @param module: string
     */
    private setSelectedModule(module) {
        this.selectedModule = module;
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
     * submit values and close the modal
     */
    private confirm() {
        if (this.disabled) return;

        this.subject.next({
            name: this.reportName,
            module: this.selectedModule
        });
        this.subject.complete();
        this.close();
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
}
