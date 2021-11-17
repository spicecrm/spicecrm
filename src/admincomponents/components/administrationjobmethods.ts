/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
