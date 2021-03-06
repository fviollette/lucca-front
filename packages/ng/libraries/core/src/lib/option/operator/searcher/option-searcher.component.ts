import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { ILuOptionOperator, ALuOptionOperator } from '../option-operator.model';
import { Observable, combineLatest, merge, of } from 'rxjs';
import { FormControl } from '@angular/forms';
@Component({
	selector: 'lu-option-searcher',
	templateUrl: 'option-searcher.component.html',
	styleUrls: ['option-searcher.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: ALuOptionOperator,
			useExisting: forwardRef(() => LuOptionSearcherComponent),
			multi: true,
		},
	],
})
export class LuOptionSearcherComponent<T = any> extends ALuOptionOperator<T> implements ILuOptionOperator<T> {
	@HostBinding('class.position-fixed') fixed = true;
	searchControl = new FormControl();
	clue$ = merge(of(''), this.searchControl.valueChanges);
	@ViewChild('searchInput', { read: ElementRef }) searchInput: ElementRef;
	set inOptions$(in$: Observable<T[]>) {
		this.outOptions$ = combineLatest(
			in$,
			this.clue$,
			(options, clue) => {
				return !!clue ? (options || []).filter(o => this.searchFn(o, clue)) : options || [];
			}
		);
	}
	@Input() searchFn: (option: T, clue: string) => boolean = () => true;
	onOpen() {
		this.searchInput.nativeElement.focus();
	}
	onClose() {
		this.searchControl.setValue('');
	}
}
