import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

@Component({
    selector: '[object-related-list-seqeunced-item]',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistsequenceditem.html',
    providers: [model, view],
    styles: [
        'td.dragged { opacity: 0.33; }'
    ]
})
export class ObjectRelatedListSequencedItem implements OnInit {
    @Input() private listfields: any[] = [];
    @Input() private listitem: any = {};
    @Input() private module = '';

    private isDragged = false;

    constructor( private model: model, private view: view, private router: Router, private language: language ) {
        this.view.isEditable = false;
    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.listitem.id;
        this.model.data = this.listitem;
    }

    private navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

    public dragstart( event ) {
        event.dataTransfer.setData( 'text/plain', this.listitem.id );
        event.dataTransfer.effectAllowed = 'move';
        this.isDragged = true;
    }

    private dragend() {
        this.isDragged = false;
    }

}
