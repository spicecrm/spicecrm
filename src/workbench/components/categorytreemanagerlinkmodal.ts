import {Component, OnInit} from "@angular/core";

import { backend } from '../../services/backend.service';
import { model } from '../../services/model.service';
import { modal } from '../../services/modal.service';
import {metadata} from "../../services/metadata.service";

@Component({
    selector: 'category-tree-manager-link-modal',
    templateUrl: '../templates/categorytreemanagerlinkmodal.html',
    providers: [model]
})

export class CategoryTreeManagerLinkModal  implements OnInit {

    /**
     * holds a reference of this component to enable destroy
     */
    public self;

    /**
     * boolean indicator that the component is loading
     */
    public loading: boolean = false;

    /**
     * active tree id
     */
    public activeTreeId: string;

    /**
     * array of input category link and selected model
     */
    public categoriesInputArray: any[] = [];

    /**
     * system modules
     */
    public sysModules: any = [];

    /**
     * boolean indicator - can save on init state
     */
    public canSaveOnInit: boolean = false;

    constructor(
        public backend: backend,
        public model: model,
        public modal: modal,
        public metadata: metadata
    ) {
        // load sys module list
        this.backend.getRequest('system/spiceui/admin/modules').subscribe(modules => {
            this.sysModules = modules;
        });
    }

    ngOnInit() {
        this.getTreeLinks();
    }

    /**
     * get tree links for active category tree
     */
    public getTreeLinks() {
        this.loading = true;
        let awaitModal = this.modal.await('loading...');

        // send data to backend
        this.backend.getRequest(`configuration/spiceui/core/categorytrees/${this.activeTreeId}/links`).subscribe({
            next: (treeLinks) => {
                this.categoriesInputArray = treeLinks;
                this.loading = false;
                
                this.canSaveOnInit = treeLinks.length !== 0;

                awaitModal.emit(true);
            },
            error: () => {
                this.loading = false;
                awaitModal.emit(true);
            }
        })
    }

    /**
     * add input item config in categoriesInputArray
     */
    public addConfig() {
        this.canSaveOnInit = true;
        this.categoriesInputArray.push({id: this.categoriesInputArray.length + 1, module_id: "",module_field: "", module_field_c1: "", module_field_c2: "", module_field_c3: "", module_field_c4: ""});
    }

    /**
     * remove input item config from categoriesInputArray
     * @param id
     */
    public deleteConfig(id) {
        this.canSaveOnInit = true;
        this.categoriesInputArray.splice(id, 1);
    }

    /**
     * check if we can save
     */
    get canSave() {
        let item = this.categoriesInputArray.find((item) => item.module_id == '' || item.module_field == '');
        return item?.module_id == '' || item?.module_field == '';
    }

    /**
     * returns the fields for a given module
     * @param module
     */
    public getModuleFields(module){
        let fieldsArrray = [];
        if(!module) return fieldsArrray;
        let fields =  this.metadata.getModuleFields(this.sysModules.find(sm => sm.id == module).module);
        for (let key of Object.keys(fields)) {
            fieldsArrray.push(fields[key].name)
        }
        // sort the array and return it
        return fieldsArrray.sort((a, b) => a.localeCompare(b));
    }

    /**
     *  save changes on backend
     */
    saveChanges() {

        let awaitModal = this.modal.await('saving...');

        // Regex to check valid
        // GUID
        let regex = new RegExp(/^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/);

        let data = this.categoriesInputArray.map((item) => {
            return {
                id: regex.test(item.id) ? item.id : this.model.generateGuid(),
                module_id: item.module_id,
                module_field: item.module_field,
                syscategorytree_id: this.activeTreeId,
                module_field_c1: item.module_field_c1,
                module_field_c2: item.module_field_c2,
                module_field_c3: item.module_field_c3,
                module_field_c4: item.module_field_c4,
            }
        });

        // send data to backend
        this.backend.postRequest(`configuration/spiceui/core/categorytrees/${this.activeTreeId}/links`, {},  data).subscribe({
            next: () => {
                awaitModal.emit(true)
                this.loading = false;
                this.close();
            },
            error: () => {
                awaitModal.emit(true)
                this.loading = false;
            }
        });
    }

    /**
     * close the modal window
     */
    public close() {
        this.self.destroy();
    }

}
