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
    OnInit,
    SimpleChanges
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modellist} from '../../../services/modellist.service';

/**
 * renders a KANBAN Tile in the kanban view
 */
@Component({
    selector: '[spice-kanban-tile]',
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

    private modelSubscription: any;

    constructor(private modellist: modellist, private model: model, private view: view, private metadata: metadata, private changeDetectorRef: ChangeDetectorRef) {
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
        this.model.data = this.model.utils.backendModel2spice(this.modellist.module, this.item);

        // initialize the field statis
        this.model.initializeFieldsStati();

        this.model.data$.subscribe(data => {
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * unsubscribe from the model so all subscriptions are cancelled
     */
    public ngOnDestroy(): void {
        if(this.modelSubscription) this.modelSubscription.unsubscribe();
    }

    /**
     * navigate to the detial of the record
     */
    private goDetail() {
        this.model.goDetail();
    }


}
