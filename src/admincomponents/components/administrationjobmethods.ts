/**
 * @module AdminComponentsModule
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {backend} from "../../services/backend.service";

@Component({
    selector: 'administration-job-methods',
    templateUrl: './src/admincomponents/templates/administrationjobmethods.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdministrationJobMethods implements OnInit {
    /**
     * holds the methods
     */
    public _methods: string[] = [];
    /**
     * holds a list of the available classes
     */
    public availableClasses: Array<{ id, name }> = [];
    /**
     * holds the concatenated value
     */
    private _value: string;
    /**
     * the current class
     */
    private _class: string = '';
    /**
     * the current method
     */
    private _method: string = '';
    public className: {id, name, group?};
    /**
     * whether the class exists or not
     */
    public classExists: boolean = false;

    constructor(public model: model,
                public view: view,
                public cdRef: ChangeDetectorRef,
                public backend: backend) {
    }

    /**
     * set the class name
     * @param className
     */
    public setClassname(className) {
        this.className = className;
        this._class = className.name;
        if (this._class != '') {
            this.validateNamespace();
        } else {
            this._method = '';
            this._methods = [];
            this.classExists = false;
        }
        this.joinValue();
    }

    /**
     * @return string method name
     */
    get methodName() {
        return this._method;
    }

    set methodName(method) {
        this._method = method;
        this.joinValue();
    }

    /**
     * subscribe to field changes
     */
    public ngOnInit() {
        this.loadAvailableClasses();
        this.subscribeToFieldChanges();
        this.subscribeToView();
    }

    /**
     * force detect changes on view change
     * @private
     */
    private subscribeToView() {
        this.view.mode$.subscribe(() => this.cdRef.detectChanges());
    }

    /**
     * load the available classes
     * @private
     */
    private loadAvailableClasses() {
        this.backend.getRequest('module/SchedulerJobTasks/classes').subscribe(list => {
            this.availableClasses = list.map(i => ({id: i, name: i})).sort();
        });
    }

    /**
     * subscribe to field changes to split the value
     * @private
     */
    private subscribeToFieldChanges() {
        this.model.observeFieldChanges('method').subscribe(() =>
            this.splitValue()
        );
    }

    /**
     * checks whether the class is valid and if public methods exist
     */
    private validateNamespace() {
        this.backend.getRequest('system/checkclass/' + btoa(this._class)).subscribe(res => {
            this.classExists = res.classexists;
            this._methods = res.methods;
            this.cdRef.detectChanges();
        });
    }

    /**
     * splits the value
     */
    private splitValue() {
        if (this._value) {
            let elements = this._value.split('->');
            this._class = elements[0];
            this.className = {id: this._class, name: this._class};
            this._method = elements[1];
            this.validateNamespace();
        }
    }

    private joinValue() {
        if (this._class != '') {
            this._value = this._class + '->' + this._method;
        } else {
            this._value = '';
        }

        this.model.setField('method', this._value);
    }
}
