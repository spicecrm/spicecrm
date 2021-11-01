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
    templateUrl: './src/include/spicetimestream/templates/spicetimestreamlabel.html',
    providers: [model, view]
})
export class SpiceTimestreamLabel implements OnInit {

    /**
     * the item
     *
     * @private
     */
    @Input() private item: any = {};

    /**
     * the module
     *
     * @private
     */
    @Input() private module: any = {};

    constructor(private elementRef: ElementRef, private metadata: metadata, private model: model, private footer: footer) {

    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.item.id;
        this.model.data = this.model.utils.backendModel2spice(this.module, this.item);
    }
}
