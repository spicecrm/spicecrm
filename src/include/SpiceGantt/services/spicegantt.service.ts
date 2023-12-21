import {Injectable} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {clone} from "underscore";
import moment, {Duration, isDate} from "moment";
import Diff = moment.unitOfTime.Diff;
import DurationConstructor = moment.unitOfTime.DurationConstructor;

/* @ignore */
declare var _: any;

@Injectable()

export class SpiceGanttService {
    private _items = []
    private _milestones = []

    constructor() {
        this._containerId = (Math.random() * new Date().getUTCMilliseconds()).toString()

        // this._items = [...Array(30).keys()].map(i => {
        //     const id = Math.random() * 10000000
        //     const name = `name-${i}`
        //     const start = moment(new Date(new Date().valueOf() - Math.random() * (1000 * 60 * 60 * 24 * 31)))
        //     const end = start.clone().add(Math.random() * 10000, 'hours')
        //
        //     return {id, name, start, end}
        // })
    }

    /*
        NODE HANDLING
    */
    public addItem(item) {
        this._items.push(item)
    }

    public addMilestone(milestone) {
        this._milestones.push(milestone)
    }

    get milestones() {
        return this._milestones
    }

    get tree() {
        return this.buildTree(this._items);
    }

    get items() {
        return this._items
    }

    public buildTree(flatItems, parent = '') {
        return flatItems
            .filter(item => item.parent === parent)
            .map(item => {
                return {
                    ...item,
                    items: this.buildTree(flatItems, item.id)
                }
            })
    }

    setNode(id: string, obj: Object, recursive = false) {
        let nestedIDs = []

        if (recursive) {
            nestedIDs = this.getNestedChildrenIds(id)
        }

        this._items = this._items.map(item => {
            if (item.id === id || nestedIDs.includes(item.id)) {
                item = {...item, ...obj}
            }

            return item
        })
    }

    private getNestedChildrenIds(id: string) {
        return this.getChildren(id).map(item => {
            return [
                item.id,
                ...this.getNestedChildrenIds(item.id)
            ]
        }).flat()
    }

    public getParent(id: string) {
        const node = this._items.find(item => item.id === id)
        if (!!node) {
            const parent = this._items.find(item => item.id === node.parent)
            if (!!parent) return parent

            return {
                expanded: true
            }
        }

        return null
    }

    public getChildren = (id: string) => this._items.filter(item => item.parent === id)

    public reset = () => this._items = []

    /*
        SCALING AND DISPLAYING GANTT-ITEMS
    */
    private _containerId: string = ''
    private _containerWidth = 0
    private _containerHeight: number = 0
    private _containerTop: number = 0
    private _zoomLevel: string = 'MONTH'

    private _showMilestones: boolean = true

    private _headerLabels = []

    get containerId(): string {
        return this._containerId
    }

    get containerTop(): number {
        return this._containerTop
    }

    set containerTop(top: number) {
        this._containerTop = top
    }

    get containerWidth(): number {
        return this._containerWidth
    }

    set containerWidth(width) {
        this._containerWidth = width

        console.log('container-width', width)
    }

    get containerHeight(): number {
        return this.itemHeight * this._items.filter(item => item.expanded === true || this.getParent(item.id).expanded || !item.parent).length
    }

    set containerHeight(height: number) {
        this._containerHeight = height
    }

    get itemHeight(): number {
        return 40
    }

    get zoomLevels() {
        return [
            {id: 'null', label: 'Automatisch', order: 0},
            // {id: 'hours', label: 'Stunden', order: 1},
            // {id: 'days', label: 'Tage', order: 2},
            {id: 'weeks', label: 'Wochen', order: 3},
            {id: 'months', label: 'Monate', order: 4},
            {id: 'quarters', label: 'Quartale', order: 5},
            {id: 'years', label: 'Jahre', order: 6},
        ]
    }

    get zoomLevel(): string {
        return this._zoomLevel
    }

    set zoomLevel(type: string) {
        this._zoomLevel = type
        this._headerLabels = this.getHeaderLabels()
    }

    get sizeOfUnit(): number {
        return this.containerWidth / this.headerLabels[0].size
    }

    get headerLabels() {
        return this._headerLabels
    }

    public getHeaderLabels() {
        let items = []

        // get lower and max bounds
        let min: moment.Moment = moment()
        let max: moment.Moment = moment()
        let range: DurationConstructor = '' as DurationConstructor
        let sizes: number[] = []

        // get duration
        let i = 0
        let duration = 0
        // const ranges = ['years', 'quarters', 'months', 'weeks', 'days', 'hours']
        const ranges: DurationConstructor[] = this.zoomLevels.filter(l => l.id !== null && l.id !== 'null')
            .sort((a, b) => {
                return b.order > a.order ? 1 : (b.order < a.order ? -1 : 0)
            }).map(l => l.id as DurationConstructor)

        if (this._zoomLevel === null) {
            while (true) {
                duration = this.maxDate.diff(this.minDate, ranges[i] as Diff, true)
                const bounds = this.getBounds(ranges[i] as DurationConstructor)
                min = bounds.min

                if (duration > 1.0) break
                i++
            }

            range = ranges[i] as DurationConstructor
        } else {
            range = this._zoomLevel as DurationConstructor

            const bounds = this.getBounds(range as DurationConstructor)
            duration = bounds.max.diff(bounds.min, range as Diff, true)

            min = bounds.min
        }

        const span = Math.ceil(duration + 1)

        console.log(this._zoomLevel, ranges, range)

        switch (range) {
            case 'years':
                return this.buildLabels(min, 'years', 'months', span, 12)
            case 'quarters':
                return this.buildLabels(min, 'quarters', 'months', span, 3)
            case 'months':
                return this.buildLabels(min, 'months', 'days', span, 31)
            case 'weeks':
                return this.buildLabels(min, 'weeks', 'days', span, 7)
            case 'days':
                return this.buildLabels(min, 'days', 'hours', span, 24)
            case 'hours':
                return this.buildLabels(min, 'hours', 'minutes', span, 60)
        }
    }

    public buildLabels(date: moment.Moment, topType: DurationConstructor, bottomType: DurationConstructor, span: number, unitSize: number) {
        let sizes: number[] = []

        if (topType === 'months') {
            sizes = [...Array(span).keys()].map(i => date.clone().add(i, topType).daysInMonth())
        } else {
            sizes = [...Array(span).keys()].map(i => unitSize)
        }

        const items = [...Array(span).keys()].map(i => {
            const sizesArray = clone(sizes).slice(0, i)
            const size = sizesArray.length ? sizesArray.reduce((acc, s) => acc + s) : 0

            return {
                start: date.clone().add(i, topType),
                end: date.clone().add(i + 1, topType),
                type: topType,
                size: sizes[i],
                items: [...Array(sizes[i]).keys()].map(m => {
                    return {
                        // start: date.clone().add(m + (i * size), bottomType).hours(0).minutes(1),
                        // end: date.clone().add((m + (i * size)) + 1, bottomType).hours(23).minutes(59),
                        start: date.clone().add(m + size, bottomType),
                        end: date.clone().add(m + size + 1, bottomType),
                        type: bottomType,
                    }
                })
            }
        })

        console.log(this.getBounds(topType).min, this.getBounds(topType).max, topType, bottomType, span, sizes, items)

        return items
    }

    get sizeOfLabelUnit(): number {
        return this._containerWidth / this.headerLabels.length
    }

    get minDate(): moment.Moment {
        const sorted = this.sortDates(clone(this._items), 'start')
        if (sorted.length) return moment(new Date(sorted[0].start)).hour(0)
        return moment(new Date())
    }

    get maxDate(): moment.Moment {
        const sorted = this.sortDates(clone(this._items), 'end').reverse()
        if (sorted.length) return moment(new Date(sorted[0].end)).hour(24)
        return moment(new Date()).add(1, 'year')
    }

    // get minDate(): moment.Moment {
    //     return moment(new Date('2023-12-01 12:00:00'))
    // }
    //
    // get maxDate(): moment.Moment {
    //     return moment(new Date('2024-04-08 15:00:00'))
    // }

    public getBounds(zoomLevel: DurationConstructor): { min: moment.Moment, max: moment.Moment } {
        // return min and max Date from list of tasks for now
        // might later be used for general scaling
        let lowerBound = this.minDate.clone()
        const upperBound = this.maxDate.clone()

        // deal with zoomlevels
        // quarters want to start at the beginning of specific months
        switch (zoomLevel) {
            case 'hours':
                lowerBound = lowerBound.minute(0)
                break
            case 'days':
                lowerBound = lowerBound.hour(0)
                break
            case 'weeks':
                lowerBound = lowerBound.day(0)
                break
            case 'months':
                lowerBound = lowerBound.date(1)
                break
            case 'quarters':
                // get current minDate month, and move lower bounds to current possible quarter
                const startMonthForQuarter = [0, 3, 6, 9].reduce((acc: number, month: number): number => {
                    return ((lowerBound.month() - month) < acc) ? month : acc
                }, 3)
                lowerBound = lowerBound.month(startMonthForQuarter)
                break
            case 'years':
                lowerBound = lowerBound.month(0).date(1)
                break
        }

        return {
            min: lowerBound,
            max: upperBound
        }
    }

    public getItemPosition(start: moment.Moment): number {
        const headerLabels = this.headerLabels
        const min = headerLabels[0].start
        const items = headerLabels[0].items
        const diff = start.diff(min, items[0].type, true)
        return this.sizeOfUnit * diff
    }

    public getItemLength(start: moment.Moment, end: moment.Moment): number {
        const headerLabels = this.headerLabels
        const items = headerLabels[0].items
        const diff = end.diff(start, items[0].type, true)
        return this.sizeOfUnit * diff
    }

    private sortDates =
        (items: any[], key: string) => items.sort((a, b) => (a[key] > b[key]) ? 1 : ((a[key] < b[key]) ? -1 : 0))


    get showMilestones() {
        return this._showMilestones
    }

    public toggleMilestones() {
        this._showMilestones = !this._showMilestones
    }
}