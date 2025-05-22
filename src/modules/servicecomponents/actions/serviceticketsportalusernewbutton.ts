import {Component, inject} from '@angular/core';
import {ObjectActionNewButton} from "../../../objectcomponents/components/objectactionnewbutton";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {model} from "../../../services/model.service";
import {of} from "rxjs";

@Component({
    selector: 'service-tickets-portal-user-new-button',
    templateUrl: '../templates/serviceticketsportalusernewbutton.html',
    providers: [model]
})
export class ServiceTicketsPortalUserNewButton extends ObjectActionNewButton {
    /**
     * injected backend service
     */
    private backend: backend = inject(backend);
    /**
     * injected modal service
     * @private
     */
    private modal: modal = inject(modal);
    /**
     * injected toast service
     * @private
     */
    private toast: toast = inject(toast);

    /**
     * retrieve a list of projects associated with the authenticated user
     * open the add modal after selecting a project
     */
    public execute(): void {

        const loading = this.modal.await('LBL_LOADING');

        this.backend.getRequest(`module/Users/current/projects`).subscribe({
            next: (projects) => {

                loading.next(true);
                loading.complete();

                if (projects.length == 0) {
                    this.toast.sendToast('ERR_USER_NOT_ASSIGNED_TO_PROJECT', 'error');
                } else {

                    const options = projects.map(project => ({display: project.name, value: project.id}));

                    let selectedProject = () => this.modal.prompt('input', '', 'LBL_PROJECT', 'default', null, options, 'radio');

                    if (projects.length == 1) {
                        selectedProject = () => of(projects[0].id);
                    }

                    selectedProject().subscribe(id => {

                        if (!id) return;
                        this.model.setFields({
                            project_id: id,
                            project_name: projects.find(project => project.id == id).name
                        });

                        this.addNewTab();
                    });

                }
            },
            error: () => {
                this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                loading.next(true);
                loading.complete();
            }
        });
    }
}