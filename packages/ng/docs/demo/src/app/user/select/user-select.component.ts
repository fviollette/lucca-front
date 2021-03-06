import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
declare var require: any;

@Component({
	selector: 'demo-user-select',
	templateUrl: './user-select.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [],
})
export class DemoUserSelectComponent implements OnInit {
	snippets = {
		basic: {
			code: require('!!prismjs-loader?lang=typescript!./basic/basic'),
			markup: require('!!prismjs-loader?lang=markup!./basic/basic.html'),
		},
		searcher: {
			code: require('!!prismjs-loader?lang=typescript!./searcher/searcher'),
			markup: require('!!prismjs-loader?lang=markup!./searcher/searcher.html'),
		},
		scoped: {
			code: require('!!prismjs-loader?lang=typescript!./scoped/scoped'),
			markup: require('!!prismjs-loader?lang=markup!./scoped/scoped.html'),
		},
	};

	constructor() {}

	ngOnInit() {}
}
