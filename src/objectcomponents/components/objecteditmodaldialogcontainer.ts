/**
 * @module ObjectComponents
 */

import {
    AfterViewInit,
    Component,
    Input,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'object-edit-modal-dialog-container',
    templateUrl: './src/objectcomponents/templates/objecteditmodaldialogcontainer.html'
})
export class ObjectEditModalDialogContainer implements AfterViewInit {
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;
    private componentRefs: Array<any> = [];
    @Input() private componentSet: String = '';
    @Input() private module: String = '';

    constructor(private model: model, private metadata: metadata) {

    }

    public ngAfterViewInit() {
        this.renderComponentSet();
    }

    private renderComponentSet() {

        for (let component of this.componentRefs) {
            component.destroy();
        }

        if(!this.componentSet || this.componentSet == '') {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
            this.componentSet = componentconfig.componentset;
        }
        for (let thisComponent of this.metadata.getComponentSetObjects(this.componentSet)) {
            this.metadata.addComponent(thisComponent.component, this.container).subscribe(componentRef => {
                componentRef.instance.componentconfig = thisComponent.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

}