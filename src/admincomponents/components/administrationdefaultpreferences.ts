/**
 * @module AdminComponentsModule
 */
import {Component, OnInit} from "@angular/core";
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {view} from "../../services/view.service";
import {configurationService} from "../../services/configuration.service";

/**
 * render the default preferences modal
 */
@Component({
    selector: 'administration-default-preferences',
    templateUrl: './src/admincomponents/templates/administrationdefaultpreferences.html',
    providers: [view]
})
export class AdministrationDefaultPreferences implements OnInit {
    /**
     * holds the loaded preferences
     * @private
     */
    private preferences: any = {};

    constructor(private backend: backend,
                private toast: toast,
                private language: language,
                private configuration: configurationService,
                private view: view,
                private modal: modal) {
    }

    public ngOnInit() {
        this.loadPreferences();
    }

    /**
     * load default preferences from backeend
     * @private
     */
    private loadPreferences() {
        const loadingModal = this.modal.await('LBL_LOADING');

        this.backend.getRequest('configuration/configurator/editor/default_preferences').subscribe(data => {
            this.preferences = data;
            loadingModal.emit();
            loadingModal.complete();
        });
    }

    /**
     * save changes
     * @private
     */
    private save() {
        const loadingModal = this.modal.await('LBL_SAVING_DATA');

        this.backend.postRequest('configuration/configurator/editor/default_preferences', [], { config: this.preferences }).subscribe(data => {
            this.configuration.setData('defaultuserpreferences', this.preferences);
            this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            this.view.setViewMode();
            loadingModal.emit();
            loadingModal.complete();
        });

    }
}
