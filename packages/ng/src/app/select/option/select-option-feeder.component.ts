import {
	Component,
	OnInit,
} from '@angular/core';
import {ISelectOptionFeeder} from './select-option-feeder.model';

/**
 * The component that provides available options for lu-select
 */
@Component({
	template: '',
})
export class AbstractSelectOptionFeederComponent<T> implements ISelectOptionFeeder<T>, OnInit {

	ngOnInit(): void {
		console.log('AbstractSelectOptionFeederComponent.OnInit');
	}
	_emitter: (T) => void;
	subscribe(next: (T: any) => void) {
		console.log('AbstractSelectOptionFeederComponent.subscribe');
		this._emitter = next;
	}
	/**
	 * See ISelectOptionFeeder
	 */
	hasFocus(): boolean {
		return false;
	}

	emit(value: T): void{
		console.log('AbstractSelectOptionFeederComponent.emit');
		this._emitter(value);
	}

}
