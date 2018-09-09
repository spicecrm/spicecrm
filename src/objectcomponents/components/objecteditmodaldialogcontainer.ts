/**
 * Created by christian on 08.11.2016.
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'object-edit-modal-dialog-container',
    templateUrl: './app/objectcomponents/templates/objecteditmodaldialogcontainer.html'
})
export class ObjectEditModalDialogContainer implements AfterViewInit {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
    componentRefs: Array<any> = [];
    @Input() componentSet: String = '';
    @Input() module: String = '';

    constructor(private model: model, private metadata: metadata) {

    }

    ngAfterViewInit() {
        this.renderComponentSet();
    }

    renderComponentSet() {

        for (let component of this.componentRefs) {
            component.destroy();
        }

        if(this.componentSet == '') {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
            this.componentSet = componentconfig.componentset;
        }
        for (let thisComponent of this.metadata.getComponentSetObjects(this.componentSet)) {
            this.metadata.addComponent(thisComponent.component, this.container).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = thisComponent.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

}