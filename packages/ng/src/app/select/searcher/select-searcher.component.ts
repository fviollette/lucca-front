import {
	Component,
	Input,
	AfterContentInit,
	ContentChildren,
	ViewChild,
	ElementRef,
	forwardRef,
	ChangeDetectorRef,
	OnDestroy,
	QueryList
} from '@angular/core';
import { ISelectSearcher } from './select-searcher.model';
import { AbstractSelectOptionFeederComponent } from '../option/select-option-feeder.component';
import { LuSelectOption } from '../option/select-option.component';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { LuSelectSearchIntl } from './select-searcher-intl';

@Component({
	selector: 'lu-select-searcher',
	templateUrl: './select-searcher.component.html',
	styleUrls: ['./select-searcher.component.scss'],
	providers: [{provide: AbstractSelectOptionFeederComponent, useExisting: forwardRef(() => LuSelectSearcherComponent)}]
})
/**
 * Component that manage the possibility to search in the options of a select.
 */
export class LuSelectSearcherComponent<T>
	extends AbstractSelectOptionFeederComponent<T>
	implements ISelectSearcher<T>,
		OnDestroy,
		AfterContentInit {

	_clue = '';
	private _focus = false;
	_noResults = false;
	private _clue$: Subject<string> = new Subject<string>();

	private _intlChanges: Subscription;

	private innerMap = {};

	private _originalList:  LuSelectOption<T>[];
	/**
	 * The options detected
	 */
	@ContentChildren(LuSelectOption, { descendants: true }) luOptions: QueryList<LuSelectOption<T>>;
	@ViewChild('inputClue') _inputElement : ElementRef;
	@ViewChild('scrollElement') _scrollElement : ElementRef;


	constructor(public _intl: LuSelectSearchIntl,
		private _changeDetectorRef: ChangeDetectorRef) {
		super();
		this._clue$
		.debounceTime(100) // wait 100ms after the last event before emitting last event
		.distinctUntilChanged() // only emit if value is different from previous value
		.subscribe(model => {
			this._clue = model;
			// Call the filter function
			const optionsFiltered = this.filter(this._clue, this._originalList);
			this._noResults = optionsFiltered.length === 0;
			this.luOptions.reset(optionsFiltered);
			this.luOptions.notifyOnChanges();
			if (this._callbackOptions){
				this._callbackOptions(optionsFiltered);
			}
		});
		this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());
	}

	ngOnDestroy() {
		this._intlChanges.unsubscribe();
	}

	ngAfterContentInit(): void {
		this._originalList = this.luOptions.toArray();
	}

	_onMouseDown($e) {
		this._focus = true;
		// We prevent propagation to avoid lost of focus in input field
		$e.stopPropagation();
	}

	_onBlur() {
		this._focus = false;
		// When we quit the field, we reset the search item
		this._clue = '';
		this.luOptions.reset(this._originalList);
		this.luOptions.notifyOnChanges();
		this._callbackOptions(this._originalList);
		this._originalList.forEach(luOption => luOption.displayed = true);
	}

	_onKeydown($event: KeyboardEvent){
		this._callbackKeyEvent($event);
	}

	/**
	 * See ISelectSearcher
	 */
	filter(clue: string, options: LuSelectOption<T>[]): LuSelectOption<T>[] {
		const normalizeClue = clue.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
		return options.filter((option) => {
			let valueOption = this.innerMap[option.viewValue];
			if (!valueOption){
				this.innerMap[option.viewValue] = option.viewValue.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
				valueOption = this.innerMap[option.viewValue];
			}

			const match = valueOption.indexOf(normalizeClue) !== -1;
			option.displayed = match;
			return match;
		});
	}

	/**
	 * See ISelectOptionFeeder
	 */
	hasFocus(): boolean {
		return this._focus;
	}

	_onFieldChange(clue: string) {
		this._clue$.next(clue);
	}

	/**
	 * See ISelectOptionFeeder
	*/
	open(): void {
		this._focus = true;
		this._inputElement.nativeElement.focus();
	}

	/**
	 * See ISelectOptionFeeder
	 */
	scrollTo(index: number) {
		const luOption = this.luOptions.toArray()[index];

		this._scrollElement.nativeElement.scrollTop = luOption.offsetTop();

	}

}
