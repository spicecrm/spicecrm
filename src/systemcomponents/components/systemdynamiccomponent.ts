/**
 * @module SystemComponents
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    EventEmitter,
    AfterViewInit,
    Input,
    Output,
    OnChanges, SimpleChanges
} from '@angular/core';
import {metadata} from '../../services/metadata.service';

/**
 * renders a container with a dynamic component rendered therein
 */
@Component({
    selector: 'system-dynamic-component',
    templateUrl: '../templates/systemdynamiccomponent.html'
})
export class SystemDynamicComponent implements AfterViewInit, OnChanges {

    /**
     * the reference to the container in the template
     */
    @ViewChild('container', {read: ViewContainerRef, static: true}) public container: ViewContainerRef;

    /**
     * the component to be rendered
     */
    @Input() public component: string = '';

    /**
     * the componentconfig
     */
    @Input() public componentconfig: any;

    /**
     * componentparameters to be set to the instance
     */
    @Input() public componentattributes: any;

    /**
     * the componentref that is created. The component will emit that
     */
    @Output() public componentref: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the component that is rendered
     */
    public _component: any;

    /**
     *
     */
    public initialized: boolean = false;

    constructor(public metadata: metadata) {
    }

    /**
     * after view init add the component via the metadata service
     */
    public ngAfterViewInit() {
        if (!this.initialized) {
            this.renderComponent();
        }
    }

    /**
     * react to changes
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (this.container && changes.component) {
            if (this._component) {
                this._component.destroy();
                this._component = undefined;
            }
            this.renderComponent();

            this.initialized = true;

        }
    }

    public renderComponent() {
        if (this.component) {
            this.metadata.addComponent(this.component, this.container).subscribe(componentref => {
                this.componentref.emit(componentref);

                // if we have the componetconfig .. add it
                if (this.componentconfig) {
                    componentref.instance.componentconfig = this.componentconfig;
                }

                // set additonal attributes
                if (this.componentattributes) {
                    for (let attrib in this.componentattributes) {
                        componentref.instance[attrib] = this.componentattributes[attrib];
                    }
                }

                this._component = componentref;
            });
        }
    }
}
