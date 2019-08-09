/**
 * @module ModuleSpicePath
 */
import {Component, Input, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modellist} from '../../../services/modellist.service';

@Component({
    selector: '[spice-kanban-tile]',
    templateUrl: './src/include/spicepath/templates/spicekanbantile.html',
    providers: [model, view],
    host: {
        '[class]': "'slds-item'"
    }
})
export class SpiceKanbanTile implements OnInit {
    @Input() private item: any = {};
    private componentconfig: any = {};
    private componentFields: any = {};

    constructor(private modellist: modellist, private model: model, private view: view, private metadata: metadata) {
        this.componentconfig = this.metadata.getComponentConfig('SpiceKanbanTile', this.modellist.module);
        this.componentFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);

        // display short labels
        this.view.labels = 'short';
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        // initialize the model
        this.model.module = this.modellist.module;
        this.model.id = this.item.id;
        this.model.data = this.model.utils.backendModel2spice(this.modellist.module, this.item);
    }

    private goDetail() {
        this.model.goDetail();
    }
}
