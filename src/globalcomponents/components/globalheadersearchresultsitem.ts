import {
    Component, Input, EventEmitter,
    OnInit, Output
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {fts} from '../../services/fts.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {popup} from '../../services/popup.service';
import {Router} from '@angular/router';

@Component({
    selector: '[global-header-search-results-item]',
    templateUrl: './src/globalcomponents/templates/globalheadersearchresultsitem.html',
    providers: [model],
    host: {
        "(click)": "navigateTo()"
    }
})
export class GlobalHeaderSearchResultsItem implements OnInit {
    @Input() private hit: any = {};
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private model: model, private router: Router, private language: language) {}

    private navigateTo() {
        this.selected.emit(true);
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

    private gethref() {
        return '#/module/' + this.model.module + '/' + this.model.id;
    }

    public ngOnInit() {
        this.model.module = this.hit._type;
        this.model.id = this.hit._id;
        for (let field in this.hit._source) {
            this.model.data[field] = this.hit._source[field];
        }
    }
}
