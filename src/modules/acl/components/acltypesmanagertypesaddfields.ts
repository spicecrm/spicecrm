import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter,
    Input,
    OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'acltypes-manager-types-add-fields',
    templateUrl: './app/modules/acl/templates/acltypesmanagertypesaddfields.html',
})
export class ACLTypesManagerTypesAddFields implements OnInit{

    @Input() module: string = '';
    self: any = {};
    currentfields: Array<any> = [];
    fields: Array<any> = [];
    field: string = '';
    addfield: EventEmitter<string> = new EventEmitter<string>();

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {

    }

    ngOnInit(){
        let fields = this.metadata.getModuleFields(this.module);

        let activeFields = [];
        for(let currentField of this.currentfields){
            activeFields.push(currentField.name);
        }

        for(let field in fields){
            if(this.allowField(fields[field]) && activeFields.indexOf(field) < 0)
                this.fields.push(field);
        }

    }

    allowField(field){
        return field.source != 'non-db' && field.type != 'link' && field.type != 'relate';
    }

    close(){
        this.self.destroy();
    }

    add(){
        this.addfield.emit(this.field);
        this.close();
    }

}