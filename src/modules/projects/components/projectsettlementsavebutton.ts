/**
 * @module ModuleProjects
 */
import {Component, EventEmitter, input, OnInit, Output} from '@angular/core';
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {firstValueFrom} from "rxjs";
import {projectwbsHierarchy} from "../services/projectwbshierarchy.service";

@Component({
    selector: 'project-settlement-save-button',
    template: '<button class="slds-button slds-button--brand" [disabled]="disabled()" (click)="save()"><system-label label="LBL_SAVE"/></button>',
    standalone: false,
    providers: [model]
})
export class ProjectSettlementSaveButton implements OnInit {

    public disabled = input<boolean>(false);

    /**
     * hold the selected activity models to be checked if dirty and saved if true
     */
    public activityModels = input<Map<string, model>>();

    /**
     * emits when the model is saved
     */
    @Output() public saved$: EventEmitter<void> = new EventEmitter<void>();

    constructor(public model: model,
                public backend: backend,
                public wbshierarchy: projectwbsHierarchy,
                public toast: toast,
                public modal: modal) {
    }

    ngOnInit() {
        this.model.module = 'ProjectSettlements';
        this.model.initializeModel();
    }

    public async save() {
        let addModelRes = await firstValueFrom(this.model.addModel('', null, {projectwbselement_id: this.wbshierarchy.project_id()}));

        if (!addModelRes) return;

        let awaitModal = this.modal.await('LBL_SAVING');

        this.activityModels().forEach(item => {
            if (item.isDirty()) {
                item.save(false, true)
            }
        });

        const activityIds = [...this.activityModels().keys()];

        this.backend.postRequest(`module/${this.model.module}/${this.model.id}/related/projectactivities`, {}, activityIds)
            .subscribe({
                next: () => {
                    this.saved$.emit();
                    awaitModal.emit(true);
                },
                error: () => {
                    awaitModal.emit(true);
                }
            })
    }
}
