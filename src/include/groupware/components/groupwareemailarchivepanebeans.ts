/**
 * @module ModuleGroupware
 */
import {ChangeDetectorRef, Component, Injector, NgZone} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {language} from '../../../services/language.service';
import {SystemSelectModuleModal} from "../../../systemcomponents/components/systemselectmodulemodal";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";

/**
 * Outlook add-in beans pane showing a checklist of beans that use the email addresses found in the email.
 * Any beans already linked to the email will have their checkboxes selected.
 */
@Component({
    selector: 'groupware-email-archive-pane-beans',
    templateUrl: '../templates/groupwareemailarchivepanebeans.html'
})
export class GroupwareEmailArchivePaneBeans {
    /**
     * is loading flag
     */
    public isLoading: boolean = true;
    /**
     * boolean for is creating
     */
    public isCreating: boolean = false;
    /**
     * the selected module
     */
    public selectedModule: string;
    /**
     * the available modules
     */
    public availableModules: string[] = [];

    constructor(
        public groupware: GroupwareService,
        public language: language,
        private zone: NgZone,
        private injector: Injector,
        private modal: modal,
        public cdref: ChangeDetectorRef,
        private metadata: metadata

    ) {
        this.getAvailableModules();

        this.groupware.loadLinkedBeans().subscribe({
            next: () => this.isLoading = false,
            error: () => this.isLoading = false
        });
    }

    /**
     * Related beans.
     */
    get beans() {
        return this.groupware.relatedBeans;
    }

    public handleCreateAction(bean) {
        this.isCreating = false;
        if (bean) {
            this.groupware.addBean(bean);
        }
    }

    /**
     * get the available modules from the config and check for the create acl permission
     * @private
     */
    private getAvailableModules() {
        const config = this.metadata.getComponentConfig('GroupwareCreateBean');
        this.availableModules = (config.modules?.split(',').map(e => e.trim()) ?? ['Contacts']).filter(m => m != 'Users' || this.metadata.checkModuleAcl(m, 'create'))
    }

    public create(){

        this.zone.run(() => {
            this.modal.openStaticModal(SystemSelectModuleModal, true, this.injector).subscribe(modalRef => {

                modalRef.instance.modules = this.availableModules;
                this.cdref.detectChanges();
                modalRef.instance.module$.subscribe({
                    next: module => {
                        this.selectedModule = module;
                        this.isCreating = true;
                    }
                });
            });
        });
    }
}
