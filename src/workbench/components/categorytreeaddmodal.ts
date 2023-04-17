/**
 * @module WorkbenchModule
 */
import {Component, EventEmitter, OnInit} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {backend} from "../../services/backend.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {broadcast} from "../../services/broadcast.service";

@Component({
    selector: 'category-tree-add-modal',
    templateUrl: '../templates/categorytreeaddmodal.html',
})

export class CategoryTreeAddModal implements OnInit {

    /**
     * holds self instance
     */
    public self: any;

    /**
     * holds name of the category tree
     */
    public name: string;

    /**
     * holds component config
     */
    public componentconfig: any = {};

    /**
     * holds components
     */
    public components: any[] = [];

    /**
     * holds value of the selected component name
     */
    public selectedComponent: string;

    /**
     * holds array of category trees
     */
    public categoryTrees: any[] = [];

    /**
     * holds id of the newly created category tree
     */
    public newActiveTreeId: string;

    /**
     * emits the action CategoryTreeManager
     */
    public action: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public utils: modelutilities,
        public toast: toast,
        public modal: modal,
        public broadcast: broadcast
    ) { }

    public ngOnInit():void {
        this.componentconfig = this.metadata.getComponentConfig('CategoryTreeAddModal');

        this.getComponentsList();
    }

    /**
     * retrieves an array of components
     */
    public getComponentsList():void {
        this.components = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
    }

    /**
     * closes the modal window
     */
    public close() {
        this.self.destroy();
    }

    /**
     * disables save button
     */
    get disabled(): boolean {
      if (!this.name) return true;
    }

    /**
     * returns the selected component's name
     * @return string
     */
    get value(): string {
        return this.selectedComponent;
    }

    /**
     * sets the selected component (component's name not id)
     * @param component
     */
    set value(component: string) {
        this.selectedComponent = component;
    }

    /**
     * saving category tree
     */
    public save(): void {
        const loadingModal = this.modal.await('LBL_SAVING_DATA');

        // sets id of the new active tree
        this.newActiveTreeId = this.utils.generateGuid();

        this.backend.postRequest(`configuration/spiceui/core/categorytrees/${this.newActiveTreeId}`, {}, {
            id: this.newActiveTreeId,
            name: this.name,
            add_params_component: this.selectedComponent
        }).subscribe({
            next: () => {

                // emit updated categoryTrees array back to CategoryTreeManager
                let data = {
                    id: this.newActiveTreeId,
                    name: this.name,
                    add_params_component: this.selectedComponent
                }
                this.categoryTrees.push(data);
                this.action.emit('save');
                loadingModal.emit(true);

                this.close();
                this.toast.sendToast('LBL_CATEGORYTREE_SAVED', 'success')
            },
            error: () => {
                loadingModal.emit(true)
                this.toast.sendToast('LBL_SAVING_ERROR', 'error')
            }
        });
    }
}