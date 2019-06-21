/**
 * @module SystemComponents
 */
import {Component, ViewChild, ViewContainerRef, EventEmitter, AfterViewInit, Input, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-dynamic-component',
    templateUrl: './src/systemcomponents/templates/systemdynamiccomponent.html'
})
export class SystemDynamicComponent implements AfterViewInit{

    @ViewChild('container', {read: ViewContainerRef, static: false}) container: ViewContainerRef;
    @Input() component: string = '';
    @Output() componentref: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata) {}

    ngAfterViewInit(){
        this.metadata.addComponent(this.component, this.container).subscribe(componentref => {
            this.componentref.emit(componentref);
        })
    }

}