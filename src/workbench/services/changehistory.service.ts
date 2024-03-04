import {ChangeDetectorRef, Injectable} from '@angular/core';
import {ChangeHistoryActionI, ChangeHistoryRecordI} from "../interfaces/workbench.interfaces";

@Injectable()
export class ChangeHistoryService {
    /**
     * holds the changes in object keys array values
     */
    private changes: {[key: string]: {changedObjects: Map<string, any>, newObjects: Map<string, any>}} = {};
    /**
     * array of references to trackable arrays
     * @private
     */
    private trackableObjects = new Map<string, any>();
    /**
     * holds the history records
     * @private
     */
    private history: ChangeHistoryRecordI[] = [];
    /**
     * holds the history current index
     * @private
     */
    private historyCurrentIndex: number = -1;

    constructor(private cdRef: ChangeDetectorRef) {
    }

    /**
     * generate a proxy object that implements a change check, when a property set is called
     * @param obj
     * @param dbObject
     * @param scope
     */
    public generateTrackableObject(obj: any, dbObject: any, scope: string): any {

        if (this.trackableObjects.has(obj.id)) {
            return this.trackableObjects.get(obj.id);
        }

        const check = (obj: any, scope: string, prop: symbol | string, previousValue: any, newValue: any) => this.checkForObjectChanges(obj, dbObject, scope, prop, previousValue, newValue);
        return this.generateProxyObject(obj, scope, check);
    }

    /**
     * generate trackable new object that did not exist yet
     * @param obj
     * @param scope
     * @param validator
     */
    public generateTrackableNewObject(obj: any, scope: string, validator?: (obj: any) => boolean) {

        if (this.trackableObjects.has(obj.id)) {
            return this.trackableObjects.get(obj.id);
        }

        const check = (obj: any, scope: string, prop: symbol | string, previousValue: any, newValue: any) => {

            if (!validator || validator(obj)) {
                this.registerOrUpdateNewObject(obj, scope, prop, previousValue, newValue);
            } else {
                this.rollbackNewObject(obj, scope);
            }
        };

        return this.generateProxyObject(obj, scope, check);
    }

    /**
     * generate a proxy object of the target object
     * @param obj
     * @param scope
     * @param check
     * @private
     */
    private generateProxyObject(obj: any, scope: string, check: (obj: any, scope: string, prop: symbol | string, previousValue: any, newValue: any) => void) {

        const trackable = new Proxy(obj, {

            set(target: any, prop: string | symbol, newValue: any) {

                const previousValue = target[prop];

                if (window._.isEqual(previousValue, newValue)) return true;

                Reflect.set(target, prop, newValue);
                check(obj, scope, prop, previousValue, newValue);
                return true;
            }
        });

        this.trackableObjects.set(obj.id, trackable);

        return trackable;
    }

    /**
     * get all changes for new and existing objects in one array
     * @param scope
     */
    public getAllChanges(scope: string): any[] {
        return Array.from(this.changes[scope]?.changedObjects.values() ?? []).concat(
            Array.from(this.changes[scope]?.newObjects.values() ?? [])
        );
    }

    /**
     * apply changes to the passed db array
     * @param dbArray
     * @param scope
     */
    public applyChanges(dbArray: any[], scope: string) {

        if (!this.changes[scope]) return;

        this.changes[scope].changedObjects.forEach(changedObj => {
            this.setChangedObjectFirstUpdate(changedObj);
            dbArray.some((dbObj, index: number) => {
                if (dbObj.id != changedObj.id) return false;
                dbArray[index] = changedObj;
                return true;
            });
        });

        this.changes[scope].newObjects.forEach(newObj =>
            dbArray.push(newObj)
        );

        this.initializeScope(scope);
    }

    /**
     * set changed object first update
     * @param obj
     * @private
     */
    private setChangedObjectFirstUpdate(obj: {id: string}) {

        if (this.historyCurrentIndex +1 < this.history.length) {
            this.history.length = this.historyCurrentIndex +1;
        }

        let lastChangeIdx: number;
        const firstChangeIdx = this.history.findIndex(r => r.id == obj.id);

        if (firstChangeIdx < 0) return;

        for (let i = this.history.length - 1; i >= 0; i--) {
            if (this.history[i].id != obj.id) continue;
            lastChangeIdx = i;
            break;
        }


        this.history[firstChangeIdx].action = 'update';
        this.history[lastChangeIdx].action = 'afterSaveFirstUpdate';
    }

    /**
     * initialize scope object
     * @param scope
     * @private
     */
    private initializeScope(scope: string) {
        this.changes[scope] = {changedObjects: new Map<string, any>(), newObjects: new Map<string, any>()};
    }

    /**
     * register a new object in the new objects array
     * @param scope
     * @param obj
     * @param prop
     * @param previousValue
     * @param newValue
     * @private
     */
    public registerOrUpdateNewObject(obj: any, scope: string, prop: symbol | string, previousValue: any, newValue: any) {

        if (!this.changes[scope]) this.initializeScope(scope);

        if (!this.changes[scope].newObjects.has(obj.id)) {
            this.changes[scope].newObjects.set(obj.id, {...obj});
            this.history.push({id: obj.id, obj, action: "new", scope});
            this.addNewHistoryRecord(obj, 'new', scope, prop, previousValue, newValue);
            this.cdRef.detectChanges();
        } else {
            this.addNewHistoryRecord(obj, 'updateNew', scope, prop, previousValue, newValue);
            this.changes[scope].newObjects.set(obj.id, {...obj});
        }
    }

    /**
     * add a new history record
     * @param obj
     * @param action
     * @param scope
     * @param key
     * @param previousValue
     * @param newValue
     * @private
     */
    private addNewHistoryRecord(obj: {id: string}, action: ChangeHistoryActionI, scope: string, key?: string | symbol, previousValue?: any, newValue?: any) {

        // trim the history array if the current index is not the last on in the history to override the later history records
        if (this.historyCurrentIndex +1 < this.history.length) {
            this.history.length = this.historyCurrentIndex +1;
        }

        this.history.push({id: obj.id, obj, action, scope, key, previousValue, newValue});

        this.historyCurrentIndex++;
    }

    /**
     * can undo
     */
    get canUndo() {
        return this.history.length > 0 && this.historyCurrentIndex >= 0;
    }

    /**
     * can redo
     */
    get canRedo() {
        return this.historyCurrentIndex +1 < this.history.length;
    }

    /**
     * undo last change
     */
    public undo() {

        if (this.historyCurrentIndex < 0) return;

        const lastChange = this.history[this.historyCurrentIndex];

        switch (lastChange.action) {
            case 'new':
                this.changes[lastChange.scope].newObjects.delete(lastChange.id);
                break;
            case 'update':
                this.changes[lastChange.scope].changedObjects.get(lastChange.id)[lastChange.key] = lastChange.previousValue;
                break;
            case 'firstUpdate':
                this.changes[lastChange.scope].changedObjects.delete(lastChange.id);
                break;
            case 'afterSaveFirstUpdate':
                this.changes[lastChange.scope].changedObjects.set(lastChange.id, lastChange.obj);
                break;
            case 'updateNew':
                this.changes[lastChange.scope].newObjects.get(lastChange.id)[lastChange.key] = lastChange.previousValue;
                break;

        }

        lastChange.obj[lastChange.key] = lastChange.previousValue;

        if (this.historyCurrentIndex > -1) {
            this.historyCurrentIndex--;
        }
    }

    /**
     * redo next change
     */
    public redo() {

        if (this.historyCurrentIndex +1 > this.history.length) return;

        const nextChange = this.history[this.historyCurrentIndex +1];

        switch (nextChange.action) {
            case 'new':

                nextChange.obj[nextChange.key] = nextChange.newValue;
                this.changes[nextChange.scope].newObjects.set(nextChange.id, nextChange.obj);
                break;
            case 'firstUpdate':
                nextChange.obj[nextChange.key] = nextChange.newValue;
                this.changes[nextChange.scope].changedObjects.set(nextChange.id, nextChange.obj);
                break;
            case 'afterSaveFirstUpdate':
                nextChange.obj[nextChange.key] = nextChange.newValue;
                this.changes[nextChange.scope].changedObjects.delete(nextChange.id);
                break;
            case 'updateNew':
            case 'update':
                const key = nextChange.action == 'updateNew' ? 'newObjects' : 'changedObjects';

                this.changes[nextChange.scope][key].get(nextChange.id)[nextChange.key] = nextChange.newValue;
                break;

        }

        if (this.historyCurrentIndex +1 < this.history.length) {
            this.historyCurrentIndex++;
        }
    }

    /**
     * rollback a new object in the new objects array
     * @param scope
     * @param obj
     * @private
     */
    public rollbackNewObject(obj: any, scope: string) {

        if (!this.changes[scope]) return;

        this.changes[scope].newObjects.delete(obj.id);
    }

    /**
     * check for object changes and write the changes
     */
    public checkForObjectChanges(currentObject: any, dbObject: any, scope: string, prop: symbol | string, previousValue: any, newValue: any) {

        if (!this.changes[scope]) this.initializeScope(scope);

        if (JSON.stringify(currentObject) == JSON.stringify(dbObject)) {
            this.changes[scope].changedObjects.delete(currentObject.id);
            return;
        }

        let action: 'update' | 'firstUpdate' = 'update';

        if (this.changes[scope].changedObjects.has(currentObject.id)) {
            this.changes[scope].changedObjects.set(currentObject.id, {...currentObject});
        } else {
            this.changes[scope].changedObjects.set(currentObject.id, {...currentObject});
            action = 'firstUpdate';
            this.cdRef.detectChanges();
        }

        this.addNewHistoryRecord(currentObject, action, scope, prop, previousValue, newValue);
    }

    /**
     * check if it has changes
     * @param scope
     */
    public hasChanges(scope: string): boolean {
        return this.changes[scope]?.changedObjects.size > 0 || this.changes[scope]?.newObjects.size > 0;
    }
}