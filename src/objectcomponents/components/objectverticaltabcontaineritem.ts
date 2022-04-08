/**
 * @module ObjectComponents
 */
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';

/**
 * renders a vertical tab continer item
 */
@Component({
    selector: 'object-vertical-tab-container-item',
    templateUrl: '../templates/objectverticaltabcontaineritem.html',
    providers: [fielderrorgrouping]
})
export class ObjectVerticalTabContainerItem implements OnInit, AfterViewInit {
    @ViewChild('container', {read: ViewContainerRef, static: true}) public container: ViewContainerRef;

    // initialized: boolean = false;

    /**
     * the componentset to be rendered in the tab
     */
    @Input() public componentset: string;

    /**
     * errors on the tabs
     */
    @Output() public taberrors = new EventEmitter();

    constructor(public metadata: metadata, public fielderrorgroup: fielderrorgrouping ) {
    }

    /**
     * set th etab group for the erro handling if ields are on multiple tabs
     */
    public ngOnInit() {
        this.fielderrorgroup.change$.subscribe( (nr) => {
            this.taberrors.emit( nr );
        });
    }

    /**
     * build the container after the view is rendered
     */
    public ngAfterViewInit() {
        // this.initialized = true;
        for (let component of this.metadata.getComponentSetObjects(this.componentset)) {
            this.metadata.addComponent(component.component, this.container).subscribe(componentRef => {
                componentRef.instance.componentconfig = component.componentconfig;
            });
        }
    }
}
