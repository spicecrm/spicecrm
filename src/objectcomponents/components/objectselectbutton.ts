/**
 * @module ObjectComponents
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';

/**
 * @deprecated
 *
 * this shoudl no longer be used anywhere
 */
@Component({
    selector: 'object-select-button',
    templateUrl: '../templates/objectselectbutton.html',
    providers: [model]
})
export class ObjectSelectButton implements OnInit {

    @Input() module: string = '';
    @Input() displaymodulename: boolean = true;
    @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();
    displayModal: boolean = false;
    popupSubscribe: any = undefined;

    constructor(public metadata: metadata, public model: model) {}

    ngOnInit() {
        this.model.module = this.module;
    }

    openModal() {
        /*
        this.displayModal = true;
        this.popupSubscribe = this.popup.closePopup$.subscribe(() => {
            this.displayModal = false;
            this.popupSubscribe.unsubscribe();
        })
        */
    }

    emitSelectedItems(event) {
        this.selectedItems.emit(event);
    }

}
