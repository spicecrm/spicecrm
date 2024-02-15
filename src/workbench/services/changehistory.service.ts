import {Injectable} from '@angular/core';

@Injectable()
export class ChangeHistoryService {

    /**
     * holds the changes in object keys array values
     */
    public changes: {[key: string]: {latestChanges: any[], dbValues: any[]}} = {};

    /**
     * get latest changes
     * @param name
     */
    public getLatestChanges(name: string): any[] {
        return this.changes[name]?.latestChanges ?? [];
    }

    /**
     * reset latest changes
     * @param name
     */
    public resetObjectChanges(name: string, obj) {

        if (!this.changes[name]) return;

        const index = this.changes[name].dbValues.findIndex(o => o.id == obj.id);

        if (index < 0) return;

        this.changes[name].dbValues[index] = {...obj};
        this.changes[name].latestChanges = [];
    }

    /**
     * register object latest changes array
     * @param obj
     * @param name
     */
    public registerObject(obj: any, name: string) {
        if (!obj) return;

        if (!this.changes[name]) {
            this.changes[name] = {latestChanges: [], dbValues: []};
        }

        if (!this.changes[name].dbValues.some(o => o.id == obj.id)) {
            this.changes[name].dbValues.push({...obj});
        }
    }

    /**
     * check for object changes and write the changes
     */
    public checkForObjectChanges(currentValue: any, name: string) {

        if (!this.changes[name]) return;

        const dbValue = this.changes[name].dbValues.find(o => o.id == currentValue.id);

        if (!dbValue) return;

        if (JSON.stringify(currentValue) == JSON.stringify(dbValue)) {
            this.changes[name].latestChanges = this.changes[name].latestChanges.filter(c => c.id != currentValue.id);
        } else {
            const idx = this.changes[name].latestChanges.findIndex(c => c.id == currentValue.id);
            if (idx > -1) {
                this.changes[name].latestChanges[idx] = currentValue;
            } else {
                this.changes[name].latestChanges.push({...currentValue});
            }
        }

    }

    /**
     * check if has changes
     * @param name
     */
    public hasChanges(name: string): boolean {
        return this.changes[name]?.latestChanges.length > 0;
    }
}