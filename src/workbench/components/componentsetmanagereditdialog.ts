import {
    Component,
    Input,
    Output,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    EventEmitter,
} from '@angular/core';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';

import {Subject} from 'rxjs';
import {field} from "../../objectfields/components/field";

@Component({
    selector: 'componensetmanager-edit-dialog',
    templateUrl: './app/workbench/templates/componentsetmanagereditdialog.html'
})
export class ComponentsetManagerEditDialog implements OnInit{
    @Output() closedialog: EventEmitter<any> = new EventEmitter<any>();
    @Input() componentset: string = '';

    adding: boolean = false;

    componentsetname: string = '';
    componentsettype: string = '';

    self;

    constructor( private metadata: metadata, private language: language) {

    }

    ngOnInit(){
        if(this.componentset !== ''){
            let componentset = this.metadata.getComponentSet(this.componentset);
            this.componentsetname = componentset.name;
            this.componentsettype = componentset.type;
            this.adding = false;
        } else {
            this.adding = true;
            this.componentsettype = 'custom';
        }
    }

    cancelDialog() {
        this.closedialog.emit(false);
        this.self.destroy();
    }

    onModalEscX() {
        this.cancelDialog();
    }

    add() {
        this.closedialog.emit({name: this.componentsetname, type: this.componentsettype});
        this.self.destroy();
    }

}