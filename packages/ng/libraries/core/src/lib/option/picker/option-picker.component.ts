import {
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	QueryList,
	Output,
	EventEmitter,
	OnDestroy,
	forwardRef,
	ViewChild,
	TemplateRef,
	ViewContainerRef,
	Renderer2,
	ChangeDetectorRef,
	AfterViewInit,
	Input,
} from '@angular/core';
import { luTransformPopover } from '../../popover/index';
import { ILuOptionItem, ALuOptionItem } from '../item/index';
import { ILuOptionPickerPanel, ALuOptionPicker } from './option-picker.model';
import { merge, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { ALuPickerPanel } from '../../input/index';
import { ALuOptionOperator, ILuOptionOperator } from '../operator/index';
import { UP_ARROW, DOWN_ARROW, ENTER } from '@angular/cdk/keycodes';

/**
* basic option picker panel
*/
@Component({
	selector: 'lu-option-picker',
	templateUrl: './option-picker.component.html',
	styleUrls: ['./option-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [luTransformPopover],
	exportAs: 'LuOptionPicker',
	providers: [
		{
			provide: ALuPickerPanel,
			useExisting: forwardRef(() => LuOptionPickerComponent),
		},
	]
})
export class LuOptionPickerComponent<T = any>
extends ALuOptionPicker<T>
implements ILuOptionPickerPanel<T>, OnDestroy, AfterViewInit {
	@Input('overlap-trigger')
	set inputOverlapTrigger(v: boolean) {
		this.overlapTrigger = v;
	}
	@Output() close = new EventEmitter<void>();
	@Output() open = new EventEmitter<void>();
	@Output() onSelectValue = new EventEmitter<T>();

	protected _isOptionItemsInitialized: boolean;

	constructor(
		protected _vcr: ViewContainerRef,
		protected _changeDetectorRef: ChangeDetectorRef,
		protected _renderer: Renderer2) {
		super();
		this.triggerEvent = 'click';
		this._isOptionItemsInitialized = false;
	}
	protected _options: ILuOptionItem<T>[] = [];
	protected _optionsQL: QueryList<ILuOptionItem<T>>;
	@ContentChildren(ALuOptionItem, { descendants: true }) set optionsQL(ql: QueryList<ILuOptionItem<T>>) {
		this._optionsQL = ql;
		this.initOptionItemsObservable();
	}
	@ContentChildren(ALuOptionItem, { descendants: true, read: ViewContainerRef }) optionsQLVR: QueryList<ViewContainerRef>;

	@ContentChildren(ALuOptionOperator, { descendants: true }) set operatorsQL(ql: QueryList<ILuOptionOperator<T>>) {
		this._operators = ql.toArray();
	}

	protected _select(val: T) {
		this.onSelectValue.emit(val);
		if (!this.multiple) {
			this.onClose();
		}
	}
	ngOnDestroy() {
		super.destroy();
	}
	ngAfterViewInit() {
		this._initHighlight();
		this._initSelected();
	}
	_emitOpenEvent(): void {
		this.open.emit();
	}
	_emitCloseEvent(): void {
		this.close.emit();
	}
	onOpen() {
		super.onOpen();
		this.highlightIndex = -1;
		// this._initObserver();
		this._applySelected();
	}
	@ViewChild(TemplateRef)
	set vcTemplateRef(tr: TemplateRef<any>) {
		this.templateRef = tr;
	}

	// keydown
	_handleKeydown(event: KeyboardEvent) {
		super._handleKeydown(event);
		switch (event.keyCode) {
			case ENTER:
				this._selectHighlighted();
				event.preventDefault();
				event.stopPropagation();
				break;
			case UP_ARROW:
				this._decrHighlight();
				event.preventDefault();
				event.stopPropagation();
				break;
			case DOWN_ARROW:
				this._incrHighlight();
				event.preventDefault();
				event.stopPropagation();
				break;
		}
	}
	// protected _highlightObserver: IntersectionObserver;
	// protected _initObserver() {

	// }
	protected _highlightIndex = -1;
	get highlightIndex() { return this._highlightIndex; }
	set highlightIndex(i: number) {
		this._highlightIndex = i;
		this._applyHighlight(true);
	}
	protected _initHighlight() {
		this._subs.add(this.optionsQLVR.changes.subscribe(options => {
			const optionCount = options.toArray().length;
			const newHighlight =  Math.max(Math.min(this.highlightIndex, optionCount - 1), -1);
			if (newHighlight !== this.highlightIndex) {
				this.highlightIndex = newHighlight;
			}
		}));
		setTimeout(() => {
			this.highlightIndex = -1;
		}, 1);
	}
	protected _incrHighlight() {
		const optionCount = this.optionsQLVR.toArray().length;
		this.highlightIndex = Math.max(Math.min(this.highlightIndex + 1, optionCount - 1), -1);
	}
	protected _decrHighlight() {
		this.highlightIndex = Math.max(this.highlightIndex - 1, -1);
	}
	protected _applyHighlight(reScroll = false) {
		if (!this.isOpen) { return; }
		const highlightClass = 'is-highlighted';
		const options = this.optionsQLVR.toArray();
		// remove `is-highlighted` class from all other options
		options.forEach(ovcr => this._renderer.removeClass(ovcr.element.nativeElement, highlightClass));
		// apply `is-highlighted` to current highlight
		const highlightedOption = options[this.highlightIndex];
		if (!!highlightedOption) {
			this._renderer.addClass(highlightedOption.element.nativeElement, highlightClass);
			// scroll to let the highlighted option visible
			if (reScroll) {
				setTimeout(() => {
					this._scrollToHighlight(highlightedOption.element.nativeElement);
				}, 1);
			}
		}
		this._changeDetectorRef.markForCheck();
	}
	protected _scrollToHighlight(targetElt: HTMLElement) {
		if (!targetElt) { return; }
		const contentElt = document.querySelector('.lu-popover-content') as HTMLElement;
		if (!contentElt) { return; }
		const contentFixedElt = document.querySelector('.lu-popover-content .position-fixed') as HTMLElement;
		const offsetTop = contentFixedElt ? contentFixedElt.offsetHeight : 0;
		// highlighted option is too high
		if (contentElt.scrollTop + offsetTop > targetElt.offsetTop) {
			contentElt.scrollTop = targetElt.offsetTop - offsetTop;
			return;
		}
		// highlight option is too low
		const offsetHeight = contentElt.offsetHeight;
		if (contentElt.scrollTop + offsetHeight < targetElt.offsetTop + targetElt.offsetHeight) {
			contentElt.scrollTop = targetElt.offsetTop + targetElt.offsetHeight - offsetHeight;
			return;
		}
	}
	protected _selectHighlighted() {
		const options = this._optionsQL ? this._optionsQL.toArray() : [];
		const highlightedOption = options[this.highlightIndex];
		if (!!highlightedOption) {
			this._updateValue(highlightedOption.value);
		}
	}
	protected _initSelected() {
		this._subs.add(this.optionsQLVR.changes.subscribe(() => {
			this._applySelected();
		}));
	}
	protected _applySelected() {
		if (!this.optionsQLVR) { return; }
		const selectedClass = 'is-selected';

		const options = this.optionsQLVR.toArray();
		// remove `is-selected` class from all other options
		options.forEach(ovcr => this._renderer.removeClass(ovcr.element.nativeElement, selectedClass));

		// add `is-selected` to all selected indexes
		const selectedIndexes = [];
		if (!this.multiple) {
			const selectedIndex = this._options.findIndex(o => JSON.stringify(o.value) === JSON.stringify(this._value));
			if (selectedIndex !== -1) { selectedIndexes.push(selectedIndex); }
			if (selectedIndex !== -1 && this.highlightIndex === -1) { this.highlightIndex = selectedIndex; }
		} else {
			const values = <T[]> this._value || [];
			selectedIndexes.push(
				...values
				.map(v => this._options.findIndex(o => JSON.stringify(o.value) === JSON.stringify(v)))
				.filter(i => i !== -1)
			);
		}
		selectedIndexes.forEach(i => {
			const option = options[i];
			if (!!option) {
				this._renderer.addClass(option.element.nativeElement, selectedClass);
			}
		});
	}

	protected initOptionItemsObservable() {
		if (this._isOptionItemsInitialized) {
			return;
		}

		this._isOptionItemsInitialized = true;

		const items$ = merge(of(this._optionsQL), this._optionsQL.changes)
			.pipe(
				map<QueryList<ILuOptionItem<T>>, ILuOptionItem<T>[]>(q => q.toArray()),
				delay(0),
			);
		items$.subscribe(o => this._options = o || []);
		this._optionItems$ = items$;
	}
}
