/**
 * @module ObjectComponents
 */
import {Component, ComponentRef, OnInit} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {layout} from "../../services/layout.service";
import {Subject} from "rxjs";
import {view} from "../../services/view.service";

/**
 * renders the passed list
 */
@Component({
    selector: "object-select-bean-list-modal",
    templateUrl: "../templates/objectselectbeanlistmodal.html",
    providers: [view]
})
export class ObjectSelectBeanListModal implements OnInit {
    /**
     * holds the list bean module
     */
    public module: string;
    /**
     * enable multiselect
     */
    public multiselect: boolean = false;
    /**
     * holds the fieldset fields
     */
    public listFields: { field: string, fieldconfig: any }[] = [];
    /**
     * the data array passed to the modal
     */
    public listData: any[];
    /**
     * subject to emit and subscribe to the selected items
     */
    public selectedIds$: Subject<string[]> = new Subject<string[]>();
    /**
     * id array of the selected items
     */
    public selectedIds: string[] = [];
    /**
     * reference of this component
     */
    public self: ComponentRef<ObjectSelectBeanListModal>;

    constructor(private layout: layout,
                private model: model,
                private view: view,
                private metadata: metadata) {
    }

    /**
     * if screen width is small
     */
    get smallView() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * load the fieldset items
     */
    public ngOnInit() {
        this.view.displayLabels = false;
        const fieldset = this.metadata.getComponentConfig('ObjectSelectBeanListModal', this.model.module);
        if (!!fieldset) {
            this.listFields = this.metadata.getFieldSetItems(fieldset);
        }
    }

    /**
     * destroy self
     */
    public close() {
        this.selectedIds$.next(undefined);
        this.selectedIds$.complete();
        this.self.destroy();
    }

    /**
     * confirm selection if multiselect is disabled
     * @param item
     */
    public onRowClick(item) {

        if (this.multiselect) return;

        this.selectedIds = [item.id];
        this.confirmSelection();
    }

    /**
     * emit the selected items
     */
    public confirmSelection() {
        this.selectedIds$.next(this.selectedIds);
        this.selectedIds$.complete();
        this.self.destroy();
    }
}
