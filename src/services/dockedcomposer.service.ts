import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject} from 'rxjs';
import {CanActivate} from '@angular/router';

import {modelutilities} from './modelutilities.service';

@Injectable()
export class dockedComposer {
    showComposer: boolean = false;
    module: string = '';

    composers: Array<any> = [];
    hiddenComposers: Array<number> = []

    public calls: any[] = [];

    constructor(private modelutilities: modelutilities) {
        this.calls = [];
    }

    addComposer(module, model = undefined) {

        if (model) {
            this.composers.splice(0, 0, {
                module: module,
                id: model.id,
                name: model.summary_text,
                model: {
                    module: module,
                    id: model.id,
                    data: model.data
                }
            });

        } else {
            this.composers.splice(0, 0, {
                module: module,
                id: this.modelutilities.generateGuid(),
                name: '',
                model: {}
            });
        }

    }

    focusComposer(id) {
        this.composers.some((composer, index) => {
            if (composer.id == id) {
                let movedComposer = this.composers.splice(index, 1);
                this.composers.unshift(movedComposer.shift());
                return true;
            }
        })
    }

    get maxComposers() {
        return Math.floor((window.innerWidth - 70) / 500);
    }
}
