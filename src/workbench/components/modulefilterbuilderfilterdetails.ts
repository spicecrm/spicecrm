/**
 * @module WorkbenchModule
 */
import {
    Component, Input, OnChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {metadata} from "../../services/metadata.service";

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'module-builder-filter-details',
    templateUrl: './src/workbench/templates/modulefilterbuilderfilterdetails.html',
})
export class ModuleFilterBuilderFilterDetails implements OnChanges {

    @Input() private filter: any;
    private primaryGroup: any = {
        logicaloperator: 'and',
        groupscope: 'all',
        conditions: []
    }

    constructor(
        private backend: backend,
        private language: language,
        private metadata: metadata,
        private toast: toast,
    ) {

    }

    public ngOnChanges(): void {
        if (this.filter) {
            if (this.filter.filterdefs) {
                this.primaryGroup = typeof this.filter.filterdefs == 'string' ? JSON.parse(this.filter.filterdefs) : this.filter.filterdefs;
            } else {
                this.primaryGroup = {
                    logicaloperator: 'and',
                    conditions: []
                };
            }
        }
    }

    private save() {
        this.cleangroup(this.primaryGroup);
        this.filter.filterdefs = this.primaryGroup;
        this.metadata.setModuleFilter(this.filter.id, this.filter.name, this.filter.module, this.filter.type);
        this.backend.postRequest('configuration/sysmodulefilters/' + this.filter.module + '/' + this.filter.id, {}, this.filter)
            .subscribe(res => this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success"));
    }

    private cleangroup(group) {
        for (let condition of group.conditions) {
            let i = group.conditions.indexOf(condition);
            if (condition.deleted === true) {
                group.conditions.splice(i, 1);
            } else {
                if (condition.conditions) {
                    this.cleangroup(group.conditions[i]);
                }
            }
        }
    }
}
