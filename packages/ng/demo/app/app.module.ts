import { AppComponent } from './app.component';
import { AutocompleteModule } from './autocomplete/autocomplete.module';
import { BrowserModule } from '@angular/platform-browser';
import { DemoLolModule } from './lol/lol.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		AutocompleteModule,
		DemoLolModule,
		BrowserModule,
		FormsModule,
		HttpModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
