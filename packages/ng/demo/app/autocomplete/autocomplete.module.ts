import { AutocompleteComponent } from './autocomplete.component';
import { BasicComponent } from './basic/basic.component';
import { CommonModule } from '@angular/common';
import { LuAutocompleteModule } from '../../../src/app/autocomplete/autocomplete.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';

@NgModule({
	imports: [
		CommonModule,
		LuAutocompleteModule,
		SharedModule,
	],
	declarations: [
		AutocompleteComponent,
		BasicComponent,
	],
	exports: [
		AutocompleteComponent,
	]
})
export class AutocompleteModule {}
