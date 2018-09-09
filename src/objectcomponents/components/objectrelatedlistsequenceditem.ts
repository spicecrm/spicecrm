import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';

@Component({
    selector: '[object-related-list-seqeunced-item]',
    templateUrl: './app/objectcomponents/templates/objectrelatedlistsequenceditem.html',
    providers: [model, view]
})
export class ObjectRelatedListSequencedItem implements OnInit {
    @Input() listfields: Array<any> = [];
    @Input() listitem: any = {};
    @Input() module: string = '';

    constructor(private model: model, private view: view, private router: Router, private language: language) {
        this.view.isEditable = false;
    }

    ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.listitem.id;
        this.model.data = this.listitem;
    }

    navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

}