import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'demo-autocomplete',
	templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent implements OnInit {
	snippets = {
		basic: {
			code: require('!!prismjs-loader?lang=typescript!./basic/basic.component'),
			markup: require('!!prismjs-loader?lang=markup!./basic/basic.component.html')
		},
	}

	constructor() { }

	ngOnInit() {
	}

}
