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
    templateUrl: '../templates/spicekanbantile.html',
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
    @Input() public item: any = {};

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * the fields to be displayed in the tile
     */
    public componentFields: any = {};

    /**
     * the subscription to the model to keep and kill on destroy
     */
    public modelSubscription: any;

    /**
     * hold various subscriptions for the tile
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public modellist: modellist, public model: model, public view: view, public metadata: metadata, public broadcast: broadcast, public changeDetectorRef: ChangeDetectorRef) {
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
        this.model.setData(_.clone(this.item));

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

        this.model.evaluateValidationRules(null, "initialize");
        this.model.initializeFieldsAlertStyles(this.item);

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
    public subscribeToSave() {

        this.modelSubscription = this.model.saved$.subscribe(changeddata => {
            // detect changes
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * subscribe to broadcast
     */
    public subscribeToBroadcast() {

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
    public goDetail() {
        this.model.goDetail();
    }


}
