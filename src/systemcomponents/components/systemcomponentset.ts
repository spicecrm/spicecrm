import {Component, Input, AfterViewInit, ViewContainerRef, ViewChild} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-componentset',
    templateUrl: './src/systemcomponents/templates/systemcomponentset.html'
})
export class SystemComponentSet implements AfterViewInit {
    @ViewChild('componentcontainer', {read: ViewContainerRef}) private componentcontainer: ViewContainerRef;
    @Input() private componentset: string = '';

    constructor(private metadata: metadata) {}

    public ngAfterViewInit() {
        if (this.componentset) {
            for (let component of this.metadata.getComponentSetObjects(this.componentset)) {
                this.metadata.addComponent(component.component, this.componentcontainer).subscribe(componentRef => {
                    componentRef.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }
}
