import {
    Component, Output, EventEmitter, Input, OnChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

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
    ) {

    }

    public ngOnChanges(): void {
        if (this.filter) {
            if (this.filter.filterdefs) {
                this.primaryGroup = JSON.parse(this.filter.filterdefs);
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
        this.filter.filterdefs = JSON.stringify(this.primaryGroup);
        this.backend.postRequest('sysmodulefilters/' + this.filter.module + '/' + this.filter.id, {}, this.filter);
    }

    private cleangroup(group) {
        let i = 0;
        for (let condition of group.conditions) {
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
