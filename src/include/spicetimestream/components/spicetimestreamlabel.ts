/**
 * @module AddComponentsModule
 */
import {
    Component,
    Input,
    ElementRef,
    OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {footer} from '../../../services/footer.service';

@Component({
    selector: '[spice-timestream-label]',
    templateUrl: '../templates/spicetimestreamlabel.html',
    providers: [model, view]
})
export class SpiceTimestreamLabel implements OnInit {

    /**
     * the item
     *
     * @private
     */
    @Input() public item: any = {};

    /**
     * the module
     *
     * @private
     */
    @Input() public module: any = {};

    constructor(public elementRef: ElementRef, public metadata: metadata, public model: model, public footer: footer) {

    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.item.id;
        this.model.setData(this.item);
    }
}
