import {AfterViewInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-checklist',
    templateUrl: './app/objectcomponents/templates/objectrecordchecklist.html',
    providers: [view]
})
export class ObjectRecordChecklist {

    componentconfig: any = {};

    get checkitems(){
        return this.componentconfig.checkitems ? this.componentconfig.checkitems : [];
    }

    get modelfield(){
        return this.componentconfig.field;
    }

}