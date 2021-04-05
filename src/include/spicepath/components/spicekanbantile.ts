/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleSpicePath
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges, OnDestroy,
    OnInit, SimpleChanges
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modellist} from '../../../services/modellist.service';
import {Subscription} from "rxjs";

declare var _: any;

/**
 * renders a KANBAN Tile in the kanban view
 */
@Component({
    selector: 'spice-kanban-tile',
    templateUrl: './src/include/spicepath/templates/spicekanbantile.html',
    providers: [model, view],
    host: {
        '[class]': "'slds-item'"
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceKanbanTile implements OnInit, OnDestroy {
    /**
     * the item
     */
    @Input() private item: any = {};

    /**
     * the componentconfig
     */
    private componentconfig: any = {};

    /**
     * the fields to be displayed in the tile
     */
    private componentFields: any = {};

    /**
     * the subscription to the model to keep and kill on destroy
     */
    private modelSubscription: any;

    /**
     * hold various subscriptions for the tile
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private modellist: modellist, private model: model, private view: view, private metadata: metadata, private broadcast: broadcast, private changeDetectorRef: ChangeDetectorRef) {
        this.componentconfig = this.metadata.getComponentConfig('SpiceKanbanTile', this.modellist.module);
        this.componentFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);

        // display short labels
        this.view.labels = 'short';
        this.view.displayLabels = false;
    }

    /**
     * initialize and subscribe to the model changes since we have an onPush startegy
     */
    public ngOnInit() {
        // initialize the model
        this.model.module = this.modellist.module;
        this.model.id = this.item.id;
        this.model.data = this.model.utils.backendModel2spice(this.modellist.module, _.clone(this.item));

        // initialize the field statis
        this.model.initializeFieldsStati();

        // handle drop from anopther kanban stage
        if (this.item._KanbanDrop) {
            // set the stage field back, start edit and set it now so it is picked up as dirty
            this.model.setField(this.modellist.bucketfield, this.item._KanbanDrop.from);
            this.model.startEdit();
            this.model.setField(this.modellist.bucketfield, this.item._KanbanDrop.to);

            // validate and if validation is OK save, otherwise popup the edit modal
            if (this.model.validate()) {
                this.model.save().subscribe(result => {
                        // remove the drop information
                        delete this.item._KanbanDrop;

                        // subscribe to the save event from now on
                        this.subscribeToSave();
                    }
                );
            } else {
                // call teh edit modal and wait for the user action (might
                this.model.edit().subscribe(action => {

                    // if action is false (user cancelled or did anything else but save move the item back to the original bucket
                    if (action === false) {
                        this.item[this.modellist.bucketfield] = this.item._KanbanDrop.from;
                    }

                    // remove the drop information
                    delete this.item._KanbanDrop;
                });

                // subscribe to the save handler
                this.subscribeToSave();
            }
        } else {
            // subscribe to the save handler
            this.subscribeToSave();
        }

        this.subscriptions.add(this.model.data$.subscribe(data => {
            this.changeDetectorRef.detectChanges();
        }));
    }

    /**
     * returns if the tab shoudl have a notification icon
     */
    get hasNotification(){
        return this.model.getField('has_notification');
    }

    /**
     * returns the headerfieldset if one is set
     */
    get headerFieldset() {
        return this.componentconfig.headerfieldset;
    }

    /**
     * subscribe to the model save event. This is required since the change detection is set to push strategy and so we need to react to changes in the component
     */
    private subscribeToSave() {

        this.modelSubscription = this.model.saved$.subscribe(changeddata => {
            // detect changes
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * subscribe to broadcast
     */
    private subscribeToBroadcast() {

        this.modelSubscription = this.model.saved$.subscribe(changeddata => {
            // detect changes
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * unsubscribe from the model so all subscriptions are cancelled
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        if (this.modelSubscription) this.modelSubscription.unsubscribe();
    }


    /**
     * navigate to the detial of the record
     */
    private goDetail() {
        this.model.goDetail();
    }


}
