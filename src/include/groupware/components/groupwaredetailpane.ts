/**
 * @module ModuleGroupware
 */
import {Component, OnDestroy, OnInit, ChangeDetectorRef, NgZone, Injector, inject, viewChild} from '@angular/core';
import {Router} from "@angular/router";
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {broadcast} from "../../../services/broadcast.service";
import {Subscription, switchMap} from "rxjs";
import {SystemSelectModuleModal} from "../../../systemcomponents/components/systemselectmodulemodal";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {GenerativeAIService} from "../../../services/generativeai.service";
import {GroupwareCreateBean} from "./groupwarecreatebean";

/**
 * Outlook add-in detail pane showing a list of beans that use the email addresses found in the email.
 * In case there is just one such bean, the details of it will be shown.
 */
@Component({
    selector: 'groupware-detail-pane',
    templateUrl: '../templates/groupwaredetailpane.html',
    standalone: false
})
export class GroupwareDetailPane implements OnInit, OnDestroy {

    /**
     * boolean indicator that the component is loading
     */
    public loading: boolean = false;

    public subscriptions: Subscription = new Subscription();
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
    /**
     * reference to the create bean component
     * @private
     */
    private groupwareCreateBean = viewChild(GroupwareCreateBean);
    /**
     * reference to the generative ai service
     * @private
     */
    private generativeAI = inject(GenerativeAIService);

    constructor(
        public groupware: GroupwareService,
        public router: Router,
        public broadcast: broadcast,
        public cdref: ChangeDetectorRef,
        private modal: modal,
        private metadata: metadata,
        private zone: NgZone,
        private injector: Injector
    ) {
    }

    /**
     * triggers the loader and if one record is found opens that one
     */
    public ngOnInit(): void {
        this.loadRecords();
        this.getAvailableModules();

        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );

    }

    /**
     * unsubscribe from teh broadcast
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * handle the broadcast message
     *
     * @param message
     */
    public handleMessage(message) {
        switch (message.messagetype) {
            case 'groupware.itemchanged':
                this.loadRecords();
                break;
        }
    }

    /**
     * loads records for the email addresses found in the item
     */
    public loadRecords() {
        this.loading = true;
        this.groupware.relatedBeans = [];
        this.cdref.detectChanges();

        this.groupware.loadLinkedBeans().subscribe(
            (res) => {
                this.loading = false;
                this.cdref.detectChanges();
            },
            (err) => {
                // todo logger service
                this.loading = false;
            }
        );
    }

    /**
     * handles the select when the user clicks a record
     *
     * @param bean
     */
    public selectBean(bean) {
        // this.loadRecord(bean.module, bean.id);
        this.router.navigate(["/groupware/details/" + bean.module + '/' + bean.id]);
    }

    public create() {

        this.zone.run(() => {
            this.modal.openStaticModal(SystemSelectModuleModal, true, this.injector).subscribe(modalRef => {

                modalRef.instance.modules = this.availableModules;
                this.cdref.detectChanges();
                modalRef.instance.module$.subscribe({
                    next: module => {
                        this.selectedModule = module;
                        this.autofillWithAIPrompt();
                        this.isCreating = true;
                    }
                });
            });
        });
    }

    /**
     * fills the model data with the data from the generative ai prompt
     * @private
     */
    private autofillWithAIPrompt() {

        const config = this.metadata.getComponentConfig('GroupwareCreateBean', this.selectedModule);

        if (!config.promptId) return;

        const loading = this.modal.await('LBL_ANALYSING_EMAIL');

        this.groupware.assembleEmail().pipe(
            switchMap(email => {
                const inputs = [JSON.stringify(email)];
                return this.generativeAI.submitPromptWithInputs(config.promptId, inputs, true);
            })).subscribe({
            next: res => {
                loading.next(true);
                loading.complete();
                if (res.length != 1) return;
                this.groupwareCreateBean().model.setFields(res[0]);
                this.cdref.detectChanges();
            },
            error: () => {
                loading.next(true);
                loading.complete();
                this.modal.toast.sendToast('ERR_FAILED_TO_EXECUTE');
            }
        });
    }

    public handleCreateAction() {
        this.isCreating = false;
    }

    /**
     * get the available modules from the config and check for the create acl permission
     * @private
     */
    private getAvailableModules() {
        const config = this.metadata.getComponentConfig('GroupwareCreateBean');
        this.availableModules = (config.modules?.split(',').map(e => e.trim()) ?? ['Contacts']).filter(m => m != 'Users' || this.metadata.checkModuleAcl(m, 'create'))
    }
}
