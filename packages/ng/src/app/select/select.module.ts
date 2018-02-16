import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { LuSelectPicker } from './picker';
import { LuSelectOption, LuOptionFeederDirective, AbstractSelectOptionFeederComponent } from './option';
import { LuSelectClearerComponent, LuSelectClearerFirstOrDefaultComponent } from './clearer';
import { LuSelectDirective } from './directive';
import { LuSelectSearcherComponent} from './searcher';
import { LuSelect } from './select.component';
import { LuEmptyModule } from '../empty/empty.module';
import { LuPopoverModule } from '../popover/popover.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		OverlayModule,
		LuPopoverModule,
		LuEmptyModule,
	],
	declarations: [
		LuSelectPicker,
		LuSelectOption,
		LuOptionFeederDirective,
		LuSelectDirective,
		LuSelectClearerComponent,
		LuSelectClearerFirstOrDefaultComponent,
		LuSelectSearcherComponent,
		LuSelect,
	],
	exports: [
		LuSelectPicker,
		LuSelectOption,
		LuOptionFeederDirective,
		LuSelectDirective,
		LuSelectClearerComponent,
		LuSelectClearerFirstOrDefaultComponent,
		LuSelectSearcherComponent,
		LuSelect,
	]
})
export class LuSelectModule { }

