import { CommonModule } from '@angular/common';
import { LuAutocompleteComponent } from './autocomplete.component';
import { NgModule } from '@angular/core';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		LuAutocompleteComponent,
	],
	exports: [
		LuAutocompleteComponent,
	]
})
export class LuAutocompleteModule {}

export { LuAutocompleteComponent } from './autocomplete.component';
