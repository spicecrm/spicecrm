/**
 * @module SystemComponents
 */
import {Component, ViewChild, ViewContainerRef, EventEmitter, AfterViewInit, Input, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';

/**
 * renders a container with a dynamic component rendered therein
 */
@Component({
    selector: 'system-dynamic-component',
    templateUrl: './src/systemcomponents/templates/systemdynamiccomponent.html'
})
export class SystemDynamicComponent implements AfterViewInit {

    /**
     * the reference to the container in the template
     */
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;

    /**
     * the component to be rendered
     */
    @Input() private component: string = '';

    /**
     * the componentconfig
     */
    @Input() private componentconfig: any;

    /**
     * the componentref that is created. The component will emit that
     */
    @Output() private componentref: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata) {
    }

    /**
     * after view init add the component via teh metadata service
     */
    public ngAfterViewInit() {
        this.metadata.addComponent(this.component, this.container).subscribe(componentref => {
            this.componentref.emit(componentref);

            // if we have the componetconfig .. add it
            if (this.componentconfig) {
                componentref.instance.componentconfig = this.componentconfig;
            }
        });
    }
}
