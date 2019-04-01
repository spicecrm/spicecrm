import {Component, Input, OnInit} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';
import {model} from '../../../services/model.service';

@Component({
    selector: 'groupware-pane-bean',
    templateUrl: './src/include/groupware/templates/groupwarepanebean.html'
})
export class GroupwarePaneBean implements OnInit{

    @Input() private bean: any;

    constructor(
        private groupware: GroupwareService,
        private model: model
    ) {
    }

    public ngOnInit() {

    }

    private onClick(event) {
        if (event.target.checked) {
            this.groupware.addBean(this.bean);
        } else {
            this.groupware.removeBean(this.bean);
        }
    }
}
