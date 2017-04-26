import { CommonModule } from '@angular/common';
import { LuAutocompleteModule } from './autocomplete/autocomplete.module';
import { LuLolModule } from './lol/lol.module';
import { NgModule } from '@angular/core';

@NgModule({
	imports: [
		LuAutocompleteModule,
		CommonModule,
		LuLolModule,
	],
	exports: [
		LuLolModule,
		LuAutocompleteModule,
	]
})
export class LuRootModule {}
