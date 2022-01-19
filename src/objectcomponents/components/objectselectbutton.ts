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
import {popup} from '../../services/popup.service';

@Component({
    selector: 'object-select-button',
    templateUrl: '../templates/objectselectbutton.html',
    providers: [model, popup]
})
export class ObjectSelectButton implements OnInit {

    @Input() module: string = '';
    @Input() displaymodulename: boolean = true;
    @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();
    displayModal: boolean = false;
    popupSubscribe: any = undefined;

    constructor(public metadata: metadata, public popup: popup, public model: model) {}

    ngOnInit() {
        this.model.module = this.module;
    }

    getModuleSingular() {
        if (this.displaymodulename)
            return this.metadata.getModuleSingular(this.module);
        else
            return '';
    }

    openModal() {
        this.displayModal = true;
        this.popupSubscribe = this.popup.closePopup$.subscribe(() => {
            this.displayModal = false;
            this.popupSubscribe.unsubscribe();
        })
    }

    emitSelectedItems(event) {
        this.selectedItems.emit(event);
    }

}
