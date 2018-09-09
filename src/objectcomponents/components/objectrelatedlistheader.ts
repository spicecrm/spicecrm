import {Component, AfterViewInit, OnInit, OnDestroy, Input} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {Router}   from '@angular/router';

@Component({
    selector: 'object-relatedlist-header',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistheader.html'
})
export class ObjectRelatedlistHeader{

    @Input() module: string = '';
    @Input() actionset: string = '';
    @Input() title: string = '';


    constructor(private language: language,  private relatedmodels: relatedmodels) {

    }

    get panelTitle(){
        return this.title != '' ? this.language.getLabel(this.title, this.module) : this.language.getModuleName(this.module)
    }

}