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
 * @module ModuleActivities
 */
import {
    Component,
    ElementRef,
    ViewChild,
    ViewContainerRef,
    Input,
    OnChanges,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';

/**
 * displays a task in the task manager view
 *
 * ToDo: change to fieldset in the header
 */
@Component({
    selector: 'tasks-manager-task-details',
    templateUrl: './src/modules/activities/templates/tasksmanagertaskdetails.html',
    host: {
        class: 'slds-theme--shade'
    },
    providers: [model, view]
})
export class TasksManagerTaskDetails implements OnChanges, OnDestroy {

    @ViewChild('detailscontent', {read: ViewContainerRef, static: true}) private detailscontent: ViewContainerRef;

    /**
     * to set the focus
     */
    @Input() private focusid: string = '';

    private viewComponent: any = null;
    private modelSubscription: any = null;

    constructor(private view: view, private language: language, private elementRef: ElementRef, private metadata: metadata, private model: model, private broadcast: broadcast) {
        this.model.module = 'Tasks';

        // subscribe to the broadcast service
        this.modelSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });

        this.view.displayLabels = false;
    }

    private handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.model.module)  return;

        switch (message.messagetype) {
            case 'model.delete':
                // what to do then ...
                break;
            case 'model.save':
                if (this.model.id === message.messagedata.id) {
                    this.model.data = message.messagedata.data;
                }
                break;
        }
    }

    public ngOnChanges() {
        // set or delete the component
        if (this.focusid) {
            if (!this.viewComponent) {
                this.metadata.addComponent('ObjectRecordDetails', this.detailscontent).subscribe(component => {
                    this.viewComponent = component;
                })
            }
        } else {
            if (this.viewComponent) {
                this.viewComponent.destroy();
                this.viewComponent = null;
            }
        }

        if (this.focusid && this.focusid != this.model.id) {
            this.model.id = this.focusid;
            this.model.getData();
        }
    }

    public ngOnDestroy() {
        this.modelSubscription.unsubscribe();
    }

    get nameStyle() {
        let styles = {};

        if (this.isCompleted){
            styles['text-decoration'] = 'line-through';
        }

        return styles;
    }

    get isCompleted() {
        return this.model.data.status == 'Completed';
    }

    get canEdit() {
        try {
            return this.model.checkAccess('edit');
        } catch (e) {
            return false;
        }
    }

    private completeTask() {
        this.model.data.status = 'Completed';
        this.model.save();
    }
}
