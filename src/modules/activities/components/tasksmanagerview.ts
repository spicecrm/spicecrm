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
import {Component, ElementRef, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {ListTypeI} from "../../../services/interfaces.service";

/**
 * a separate view on tasks that presents a tasklist and a split view with the tasks for quick task handling for the user
 */
@Component({

    templateUrl: './src/modules/activities/templates/tasksmanagerview.html',
})
export class TasksManagerView implements OnDestroy {

    /**
     * holds the subscription to the model changes
     */
    private modellistsubscribe: any = {};

    /**
     * identifies the currrent selected task that is focused
     */
    private focus: string = null;

    constructor(private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private model: model, private modellist: modellist) {

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listType$.subscribe(newType =>
            this.handleListTypeChange(newType)
        );

        this.loadList();

    }

    public ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();
    }

    /**
     * handle the list type change to reload the data only if for this component to prevent possible actions after destroy
     * @param newType
     * @private
     */
    private handleListTypeChange(newType: ListTypeI) {
        if (newType.listcomponent != 'TasksManagerView') return;
        this.loadList();
    }

    /**
     * loads the lost of tasks from the modellist service
     */
    private loadList() {
        this.focus = null;
        this.modellist.setSortField('date_due', 'ASC');
        this.modellist.getListData();
    }

    /**
     * sets the selected taks
     *
     * @param id the id of the selected task. This is emitted by the underlying component
     */
    private taskSelected(id) {
        this.focus = id;
    }
}
