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
 * @module ServiceComponentsModule
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';



@Component({
    selector: 'service-activitiytimeline-add-servicecall',
    templateUrl: './src/modules/servicecomponents/templates/serviceactivitytimelineaddservicecall.html',
    providers: [model, view]
})
export class ServiceActivitiyTimelineAddServiceCall implements OnInit {

    /**
     * the fieldset for the header. Pulled from the componentnconfig for the component and the module
     */
    private headerFieldSet: string = '';

    /**
     * the fieldset for the body. Pulled from the componentnconfig for the component and the module
     */
    private bodyFieldSet: string = '';

    public isExpanded: boolean = false;

    constructor(private metadata: metadata, private activitiytimeline: activitiytimeline, private model: model, private view: view, private language: language, private modal: modal, private ViewContainerRef: ViewContainerRef) {}

    public ngOnInit() {
        // initialize the model
        this.model.module = 'ServiceCalls';

        // subscribe to the parent models data Observable
        // name is not necessarily loaded
        this.activitiytimeline.parent.data$.subscribe(data => {
            // if we still have the same model .. update
            if (data.id == this.model.data.parent_id) {
                this.model.data.parent_name = data.summary_text;
            }
        });

        // set view to editbale and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the fields
        let componentconfig = this.metadata.getComponentConfig('ServiceActivitiyTimelineAddServiceCall', this.model.module);
        this.bodyFieldSet = componentconfig.bodyfieldset ? componentconfig.bodyfieldset : componentconfig.fieldset;
        this.headerFieldSet = componentconfig.headerfieldset;

    }

    private initializeCall(){
        this.model.module = 'ServiceCalls';
        this.model.initializeModel(this.activitiytimeline.parent);

    }

    private onFocus() {
        if(!this.isExpanded) {
            this.isExpanded = true;
            this.initializeCall();
        }
    }

    private expand(){
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector).subscribe(componentref => {
            componentref.instance.setModel(this.model);
        })
    }

    private collapse(){
        this.isExpanded = false;
    }

    private cancel(){
        this.isExpanded = false;
    }

    private save(){
        this.model.save().subscribe(data => {
            this.initializeCall();
            this.isExpanded = false;
        });
    }
}
