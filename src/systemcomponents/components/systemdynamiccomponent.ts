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
    templateUrl: './src/systemcomponents/templates/systemdynamiccomponent.html'
})
export class SystemDynamicComponent implements AfterViewInit, OnChanges {

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

    private _component: any;

    private initialized: boolean = false;

    constructor(private metadata: metadata) {
    }

    /**
     * after view init add the component via teh metadata service
     */
    public ngAfterViewInit() {
        this.renderComponent();

        this.initialized = true;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this._component) {
            this._component.destroy();
            this._component = undefined;
        }
        this.renderComponent();
    }

    private renderComponent() {
        if (this.component) {
            this.metadata.addComponent(this.component, this.container).subscribe(componentref => {
                this.componentref.emit(componentref);

                // if we have the componetconfig .. add it
                if (this.componentconfig) {
                    componentref.instance.componentconfig = this.componentconfig;
                }

                this._component = componentref;
            });
        }
    }
}
