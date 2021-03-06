import {
	ChangeDetectionStrategy,
	Component,
} from '@angular/core';

@Component({
	selector: 'basic',
	templateUrl: './basic.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
	],
})
export class BasicComponent {
	red =	{ id: 1, name: 'red' };
	green = { id: 2, name: 'green' };
	yellow =	{ id: 3, name: 'yellow' };
	blue =	{ id: 4, name: 'blue' };
	items = [this.red, this.blue];
}
