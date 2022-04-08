/**
 * @module ObjectComponents
 */
import {
    AfterViewInit,
    Component,
    Input,
    ViewChild,
    ViewContainerRef, OnDestroy, OnInit, EventEmitter, Output
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';

/**
 * the item itself rendering the tab
 */
@Component({
    selector: 'object-tab-container-item',
    templateUrl: '../templates/objecttabcontaineritem.html',
    providers: [fielderrorgrouping]
})
export class ObjectTabContainerItem implements AfterViewInit, OnDestroy {
    /**
     * an array with componentrefs to be used when the component is dexytoryed to also ensure all dynamic components are destroyed
     */
    public componentRefs: any = [];

    /**
     * internal variable to check if the component is initialized. Tabs are not initialized by default but only once the user selects a tab. This improves the load performance since related records e.g. are not yet loaded
     */
    public initialized: boolean = false;

    /**
     * the componetnset to be rendered
     */
    @Input() public componentset: string;

    /**
     * in case errors are renderd from a fieldgroup on the tab this is emitted on the tab level to guide the user in multi tabbed scenarios on the detail view
     */
    @Output() public taberrors = new EventEmitter();

    constructor(public metadata: metadata, public fielderrorgroup: fielderrorgrouping, public model: model) {
    }

    /**
     * link to the fieldgrou if there is one in the tab. If fields are int eh tabe they will link themselves to a fieldgroup
     */
    public ngOnInit() {
        this.fielderrorgroup.change$.subscribe((nr) => {
            this.taberrors.emit(nr);
        });
    }

    /**
     * initialize itself
     */
    public ngAfterViewInit() {
        this.initialized = true;
    }

    /**
     * cleanup after destroy
     */
    public ngOnDestroy() {
        for (let component of this.componentRefs) {
            component.destroy();
        }
    }
}
