import {Component, Input, ViewChild, ViewContainerRef, AfterViewInit, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'field-model-popover',
    templateUrl: './src/objectfields/templates/fieldmodelpopover.html',
    providers: [model, view]
})
export class fieldModelPopover implements OnInit{
    @Input() popovermodule: string = '';
    @Input() popoverid: string = '';
    @Input() popoverside: string = 'left';



    modelIsLoading: boolean = false;
    fields: Array<any> = [];

    constructor(private model: model, private view: view, private metadata: metadata) {

    }

    ngOnInit(){

        // load the fields
        let componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.popovermodule);
        if (componentconfig.fieldset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset)
        }

        // load the model
        this.modelIsLoading = true;
        this.model.module = this.popovermodule;
        this.model.id = this.popoverid
        this.model.getData().subscribe(() => {
            this.modelIsLoading = false;
        })
    }

    getNubbinClass(){
        return this.popoverside == 'left' ? 'slds-nubbin--right' : 'slds-nubbin--left';
    }
}