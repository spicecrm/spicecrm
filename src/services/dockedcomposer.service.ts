import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject} from 'rxjs';
import {CanActivate} from '@angular/router';

import {modelutilities} from './modelutilities.service';

@Injectable()
export class dockedComposer {
    public composers: any[] = [];
    public calls: any[] = [];
    public hiddenComposers: number[] = []


    constructor(private modelutilities: modelutilities) {
        this.calls = [];
    }

    public addComposer(module, model?) {

        if (model) {
            this.composers.splice(0, 0, {
                module,
                id: model.id,
                name: model.summary_text,
                model: {
                    module,
                    id: model.id,
                    data: model.data
                }
            });

        } else {
            this.composers.splice(0, 0, {
                module,
                id: this.modelutilities.generateGuid(),
                name: '',
                model: {}
            });
        }

    }

    public focusComposer(id) {
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
