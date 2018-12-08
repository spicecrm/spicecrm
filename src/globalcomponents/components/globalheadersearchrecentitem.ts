import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef, EventEmitter,
    OnInit, Output
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {Router} from '@angular/router';

@Component({
    selector: '[global-header-search-recent-item]',
    templateUrl: './src/globalcomponents/templates/globalheadersearchresultsitem.html',
    providers: [model],
    host: {
        "(click)": "navigateTo()"
    }
})
export class GlobalHeaderSearchRecentItem implements OnInit {
    @Input() private item: any = {};
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private model: model, private router: Router, private language: language) {

    }

    private navigateTo() {
        this.selected.emit(true);
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

    private gethref() {
        return '#/module/' + this.model.module + '/' + this.model.id;
    }

    public ngOnInit() {
        this.model.module = this.item.module_name;
        this.model.id = this.item.item_id;
        this.model.data.summary_text = this.item.item_summary;
    }
}
