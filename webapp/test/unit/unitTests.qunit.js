/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comnttdata/tic-tac-toe/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
