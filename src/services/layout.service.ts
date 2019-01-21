import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class layout {
    public headerheight = 90;

    get screenwidth() {
        let width = window.innerWidth;
        if (width >= 1024) return 'large';
        if (width >= 768) return 'medium';
        return 'small';
    }
}
