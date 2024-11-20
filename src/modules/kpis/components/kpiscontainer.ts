/**
 * @module ModuleKPIs
 */

import {Component, ElementRef, Input, OnChanges} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";
import {layout} from "../../../services/layout.service";

@Component({
    selector: 'kpis-container',
    templateUrl: '../templates/kpiscontainer.html'
})

export class KPIsContainer implements OnChanges {

    /**
     * indicates that we are loading
     */
    public loading: boolean = true;

    /**
     * holds kpis for logged in User
     */
    public groupedTargets: any[] = [];

    /**
     * the other targets
     */
    public otherTargets: any[] = [];

    /**
     * parentId the KPITarget is related to
     */
    @Input() public parentId: string = '';

    /**
     * parentType the KPITarget is related to
     * i.e. Users, CompanyCodes etc.
     */
    @Input() public parentType: string = 'Users';

    constructor(
        public session: session,
        public backend: backend,
        public toast: toast,
        public layout: layout,
        public modal: modal,
        public elementRef: ElementRef
    ) {
    }

    ngOnChanges() {
        this.loadKPIs();
    }

    /**
     * load KPIs for logged-in User
     * @private
     */
    public loadKPIs() {
        this.otherTargets = [];
        this.groupedTargets = [];
        if(this.parentId && this.parentType) {
            this.loading = true;
            this.backend.getRequest(`module/KPIs/byparent/${this.parentType}/${this.parentId}`).subscribe({
                next: (data) => {
                    this.groupTargets(data);

                    this.loading = false;
                }, error: () => {
                    this.toast.sendToast('LBL_ERR_LOADING_KPIS', 'error');
                    this.loading = false;
                }
            })
        }
    }

    /**
     * group kpi targets
     * @param kpiTargets
     * @private
     */
    private groupTargets(kpiTargets: any[]) {
        const groupedTargets: any[] = [];

        let others: any[] = [];

        if (kpiTargets.length > 0) {
            // Loop through each kpiTarget in the array

            kpiTargets.forEach((target) => {
                // Check if kpiTarget has a group
                if (target.kpi?.group) {
                    const groupName = target.kpi.group.name;
                    const groupPriority = target.kpi.group.priority;

                    // Check if the group already exists in the groupedTargets array
                    const group = groupedTargets.find(g => g.name === groupName);

                    // If the group doesn't exist, create it
                    if (!group) {
                        groupedTargets.push({
                            name: groupName,
                            priority: groupPriority,
                            targets: [target]
                        });
                    } else {
                        group.targets.push(target);
                    }
                } else {
                    this.otherTargets.push(target);
                }
            });
        }

        if(groupedTargets.length > 0 && this.otherTargets.length > 0){
            groupedTargets.push({
                name: 'other',
                priority: 99,
                targets: this.otherTargets
            });
        }

        // After grouping, sort the groups by priority in asc order
        groupedTargets.sort((a, b) => a.priority - b.priority);

        this.groupedTargets = groupedTargets;
    }


    /**
     * calculate amount of tiles displayed
     * depending on screen width
     */
    get getTileWidthClass() {
        let dim = this.elementRef.nativeElement.getBoundingClientRect()
        let count = Math.floor(dim.width / 350);
        return dim.width > 350 ?  'slds-size--1-of-' + count : 'slds-size--1-of-1';
    }
}