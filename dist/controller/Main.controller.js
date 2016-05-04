sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../sonstiges/CustomerFormat",
	"sap/m/MessageToast"
], function(jQuery, Controller, JSONModel, CustomerFormat, MessageToast) {
	"use strict";

	return Controller.extend("com.convista.controller.Main", {
		modelNavi: new sap.ui.model.json.JSONModel(),
		data: {
			navigation: [{
				title: "Zahlungseingang",
				icon: "sap-icon://simple-payment",
				tooltip: "Zahlungseingang",
				expanded : false,
				key: "page1"
			}, {
				title: "Zahlwege",
				icon: "sap-icon://money-bills",
				tooltip: "Zahlwege",
				expanded : false,
				key: "page2"
			}, {
				title: "Rückläufer",
				icon: "sap-icon://per-diem",
				expanded : false,
				key: "page3"
			}, {
				title: "Altbestände",
				icon: "sap-icon://time-overtime",
				expanded : false,
				key: "page4"
			}]
		},

		oVizFrame: null,

		onInit: function(evt) {

			this.modelNavi.setData(this.data);
			this.getView().setModel(this.modelNavi);
			this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);
			this.initCustomFormat();

			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
						visible: true
					}
				},
				valueAxis: {
					label: {
						formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_2
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				title: {
					visible: false,
					text: "Umsatz"
				}
			});
			var dataModel = new JSONModel("model/BarJsonExample.json");
			dataModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			oVizFrame.setModel(dataModel);

			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());
			//	oPopOver.setFormatString("__UI5__FloatMaxFraction2");
			//Hide Settings Panel for phone
			if (sap.ui.Device.system.phone) {
				this.getView().byId("settingsPanel").setExpanded(false);
			}
		},
		_setToggleButtonTooltip: function(bLarge) {
			var toggleButton = this.getView().byId("sideNavigationToggleButton");
			if (bLarge) {
				toggleButton.setTooltip("Large Size Navigation");
			} else {
				toggleButton.setTooltip("Small Size Navigation");
			}
		},
		onItemSelect: function(oEvent) {
			var item = oEvent.getParameter("item");
			var viewId = this.getView().getId();
			sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());
		},
		onSideNavButtonPress: function() {
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			var sideExpanded = toolPage.getSideExpanded();

			this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},

		initCustomFormat: function() {
			CustomerFormat.registerCustomFormat();
		}
		/*,
		onZahlungseingang: function() {
			MessageToast.show("Zahlungseingang ausgewählt");
		},
		onZahlwege: function() {
			MessageToast.show("Zahwege ausgewählt");
		},
		onRuecklaeufer: function() {
			MessageToast.show("Rückläufer ausgewählt");
		},
		onAltbestand: function() {
			MessageToast.show("Altbestände ausgewählt");
		}*/
	});

});