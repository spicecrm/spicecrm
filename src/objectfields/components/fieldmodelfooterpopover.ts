import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'field-model-footer-popover',
    templateUrl: './src/objectfields/templates/fieldmodelfooterpopover.html',
    providers: [model, view]
})
export class fieldModelFooterPopover implements OnInit{
    popovermodule: string = '';
    popoverid: string = '';
    popoverside: string = 'right';
    styles = null;
    mouseover: boolean = false;

    @ViewChild('popover', {read: ViewContainerRef}) popover: ViewContainerRef;

    parentElementRef: any = null;
    self: any = null;

    modelIsLoading: boolean = false;
    fields: Array<any> = [];

    constructor(
        private model:model,
        private view:view,
        private metadata:metadata,
    ) {

    }

    onMouseOver(){
        this.mouseover = true;
    }

    onMouseOut(){
       this.mouseover = false;
       // this.self.destroy();
    }

    parentMouseOut(){

    }

    get popoverStyle() {
        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();

        if(rect.left < poprect.width)
            this.popoverside = 'right';
        else
            this.popoverside = 'left';

        let styles = {
            top: (rect.top + ( (rect.height - poprect.height) / 2 )) + 'px',
            left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 15) + 'px'
        };
        //console.log(styles);
        return styles;
    }

    ngOnInit(){

        // load the fields
        let componentconfig = this.metadata.getComponentConfig('fieldModelFooterPopover', this.popovermodule);
        if (componentconfig.fieldset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset)
        } else {
            componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.popovermodule);
            if (componentconfig.fieldset) {
                this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset)
            }
        }

        // load the model
        this.modelIsLoading = true;
        this.model.module = this.popovermodule;
        this.model.id = this.popoverid;
        this.model.getData().subscribe(() => {
            this.modelIsLoading = false;
        });
        // don't know why... but this call fixes ExpressionChangedAfterItHasBeenCheckedError ... maybe because it sets the nubbin class earlier so it won't change after changedetection anymore?
        this.styles = this.popoverStyle;
    }

    getNubbinClass(){
        return this.popoverside == 'left' ? 'slds-nubbin--right' : 'slds-nubbin--left';
    }

    destroy(){

    }
}