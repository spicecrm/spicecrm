/**
 * @module ObjectComponents
 */
import {
    Component, Input, OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Observable} from 'rxjs';

import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {toast} from "../../../services/toast.service";

declare var _: any;

/**
 * renders a modal window to show all possible modules(beans) which can be created after closing an activity
 */
@Component({
    templateUrl: './src/modules/activities/templates/activityclosecreatemodal.html',
    providers: [view, model]
})
export class ActivityCloseCreateModal implements OnInit {
    /**
     * a reference to the modal content to have a reference to scrolling
     */
    @ViewChild('modalContent', {read: ViewContainerRef}) private modalContent: ViewContainerRef;
    /**
     * the componentconfig that gets passed in when the modal is created
     */
    private componentconfig: any = {};
    /**
     * the actionset items to be rendered in the modal
     */
    private actionSetItems: any = [];


    private disabled: boolean = true;

    /**
     * all modules where its possible to create new bean | STRING with ',' Seperator
     */
    private newBeanModules: any = [];

    /**
     * ToDo: add documentation what we need this for
     */
    private actionSubject: Subject<any> = new Subject<any>();
    private action$: Observable<any> = new Observable<any>();

    @Input() public preventGoingToRecord = false;

    @Input() public parent: any = {};

    /**
     * a reference to the modal itself so the modal cann close itself
     */
    private self: any = {};
    private value: string = "";

    constructor(
        private router: Router,
        private language: language,
        private model: model,
        private view: view,
        private metadata: metadata,
        private modal: modal,
        private toast: toast
    ) {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.action$ = this.actionSubject.asObservable();
    }

    /**
     * Get the actionset-items; Get all possible modules/beans from the "module configuration" and save them into an array
     */
    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig(this.constructor.name, this.parent.module);
        this.actionSetItems = this.metadata.getActionSetItems(this.componentconfig.actionset);

        let newBeanModulesString = this.componentconfig.newBeanModules;
        if(newBeanModulesString) {
            let newBeanModulesArray = newBeanModulesString.split(",");

            for (let item of newBeanModulesArray) {
                this.newBeanModules.push(this.metadata.getModuleDefs(item));
            }
        }
    }

    /**
     * destroy the component
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     * Set the module of the new model; Opens modal for new bean; self destroy
     */
    private create() {
        this.model.module = this.value;
        this.model.addModel("", this.parent);
        this.self.destroy();
    }



}
