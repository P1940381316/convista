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
				expanded: false,
				key: "page1"
			}, {
				title: "LSV-Lastschriften",
				icon: "sap-icon://money-bills",
				tooltip: "Zahlwege",
				expanded: false,
				key: "page2"
			}, {
				title: "Rückläufer",
				icon: "sap-icon://per-diem",
				expanded: false,
				key: "page3"
			}, {
				title: "Klärbestand",
				icon: "sap-icon://time-overtime",
				expanded: false,
				key: "page4"
			}]
		},

		oVizFrame: null,
		oVizFrameBarLine: null,
		oVizFrameBarLineRueck: null,

		onInit: function(evt) {

			this.modelNavi.setData(this.data);
			this.getView().setModel(this.modelNavi);
			this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);
			this.initCustomFormat();

			this.onSideNavButtonPress();

			this.initializeKompl();
			this.initializeEingansArt();
			this.showZahleinKompl();

			// ab hier Bar Line Chart Lastschrift
			var oVizFrameBarLine = this.oVizFrameBarLine = this.getView().byId("idVizFrameBarLine");
			oVizFrameBarLine.setVizProperties({
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
					text: "Lastschrift"
				}
			});
			var dataModelBarLine = new JSONModel("model/BarLineLastschrift.json");
			dataModelBarLine.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			oVizFrameBarLine.setModel(dataModelBarLine);

			var oPopOverBarLine = this.getView().byId("idPopOverBarLine");
			oPopOverBarLine.connect(oVizFrameBarLine.getVizUid());
			oPopOverBarLine.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);

			// ab hier Bar Line Chart Rüecklastschrift
			var oVizFrameBarLineRueck = this.getView().byId("idVizFrameBarLineRueck");
			oVizFrameBarLineRueck.setVizProperties({
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
					text: "Rücklastschrift"
				}
			});
			var dataModelBarLineRueck = new JSONModel("model/BarLineRuecklaeufer.json");
			dataModelBarLineRueck.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			oVizFrameBarLineRueck.setModel(dataModelBarLineRueck);

			var oPopOverBarLineRueck = this.getView().byId("idPopOverBarLineRueck");
			oPopOverBarLineRueck.connect(oVizFrameBarLineRueck.getVizUid());
			oPopOverBarLineRueck.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);

			// ab hier Bar Line Chart Klärbestand
			var oVizFrameBarLineKlaer = this.oVizFrameBarLineKlaer = this.getView().byId("idVizFrameBarLineKlaer");
			oVizFrameBarLineKlaer.setVizProperties({
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
					text: "Rücklastschrift"
				}
			});
			var dataModelBarLineKlaer = new JSONModel("model/BarLineKlaerbestand.json");
			dataModelBarLineKlaer.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			oVizFrameBarLineKlaer.setModel(dataModelBarLineKlaer);

			var oPopOverBarLineKlaer = this.getView().byId("idPopOverBarLineKlaer");
			oPopOverBarLineKlaer.connect(oVizFrameBarLineKlaer.getVizUid());
			oPopOverBarLineKlaer.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);

			//Hide Settings Panel for phone
			if (sap.ui.Device.system.phone) {
				this.getView().byId("settingsPanel").setExpanded(false);
			}
		},

		/**
		 * ab hier Eingangsarten Lastschrift, Kreditkarte , etc.
		 */

		initializeEingansArt: function() {

			var oVizFrameEingang = new sap.viz.ui5.controls.VizFrame({
				height: "100%",
				width: "100%",
				uiConfig: {
					applicationSet: "fiori"
				},
				vizProperties: {
					legend: {
						"visible": true
					},
					title: {
						"visible": false
					},
					categoryAxis: {
						title: {
							"visible": false
						}
					},
					valueAxis: {
						title: {
							"visible": false
						}
					}
				}
			});

			var oModelEingang = new JSONModel("model/LineEingangs.json");
			oModelEingang.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			oVizFrameEingang.setModel(oModelEingang);

			var oDatasetEingang = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: "month",
					value: "{month}"
				}],
				measures: [{
					name: "Lastschrift",
					value: "{lastschrift}"
				}],
				data: {
					path: "/Umsatz"
				}
			});

			var oFeedPrimaryValuesEing = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: ["Lastschrift"]
			});

			var oFeedAxisLabelsEing = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "categoryAxis",
				type: "Dimension",
				values: ["month"]
			});

			oVizFrameEingang.setDataset(oDatasetEingang);
			oVizFrameEingang.setModel(oModelEingang);
			oVizFrameEingang.addFeed(oFeedPrimaryValuesEing);
			oVizFrameEingang.addFeed(oFeedAxisLabelsEing);

			oVizFrameEingang.setVizType("column");
			this._oVizFrameEingang = oVizFrameEingang;
		},
		showZahlEingang: function() {
			var oChartContainer,
				oContent1;

			oChartContainer = this.getView().byId("idChartContainer");
			oContent1 = new sap.suite.ui.commons.ChartContainerContent({
				icon: "sap-icon://Bar-chart",
				title: "Bar Chart"
			});
			jQuery.sap.log.error("Hier >>>>>>");
			oContent1.setContent(this._oVizFrameEingang);

			oChartContainer.removeAllContent();
			oChartContainer.addContent(oContent1);
			oChartContainer.updateChartContainer();
		},

		/**
		 *  ab hier Felx
		 */
		initializeKompl: function() {
			var oVizFrameKompl1,
				oModelKompl1,
				oDatasetKompl1,
				oFeedAxisLabelsKompl1;
			// Stacked bar chart vizframe
			oVizFrameKompl1 = new sap.viz.ui5.controls.VizFrame({
				height: "100%",
				width: "100%",
				uiConfig: {
					applicationSet: "fiori"
				},
				vizProperties: {
					legend: {
						"visible": true
					},
					title: {
						"visible": false
					},
					categoryAxis: {
						title: {
							"visible": false
						}
					},
					valueAxis: {
						title: {
							"visible": false
						}
					}
				}
			});

			oModelKompl1 = new sap.ui.model.json.JSONModel("model/LineEingangsKomplett.json");
			oDatasetKompl1 = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: "gruppe",
					value: "{gruppe}"
				}],
				measures: [{
					name: "Lastschrift",
					value: "{Lastschrift}"
				}, {
					name: "Kreditkarte",
					value: "{Kreditkarte}"
				}, {
					name: "Verrechnungsscheck",
					value: "{Verrechnungsscheck}"
				}, {
					name: "PayPal",
					value: "{PayPal}"
				}],
				data: {
					path: "/Umsatz"
				}
			});

			var oFeedPrimaryValuesKompl1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: ["Lastschrift"]
			});

			var oFeedPrimaryValuesKompl2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: ["Kreditkarte"]
			});
			var oFeedPrimaryValuesKompl3 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: ["Verrechnungsscheck"]
			});
			var oFeedPrimaryValuesKompl4 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: ["PayPal"]
			});
			oFeedAxisLabelsKompl1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "categoryAxis",
				type: "Dimension",
				values: ["gruppe"]
			});

			oVizFrameKompl1.setDataset(oDatasetKompl1);
			oVizFrameKompl1.setModel(oModelKompl1);
			oVizFrameKompl1.addFeed(oFeedPrimaryValuesKompl1);
			oVizFrameKompl1.addFeed(oFeedPrimaryValuesKompl2);
			oVizFrameKompl1.addFeed(oFeedPrimaryValuesKompl3);
			oVizFrameKompl1.addFeed(oFeedPrimaryValuesKompl4);
			oVizFrameKompl1.addFeed(oFeedAxisLabelsKompl1);

			oVizFrameKompl1.setVizType("column");
			this._oVizFrameKompl1 = oVizFrameKompl1;
		},

		/**
		 * The charts or table belonging to the "sales by product" view are added
		 * to the ChartContainer.
		 */
		showZahleinKompl: function() {
			var oChartContainer,
				oContent1;

			oChartContainer = this.getView().byId("idChartContainer");
			oContent1 = new sap.suite.ui.commons.ChartContainerContent({
				icon: "sap-icon://Bar-chart",
				title: "Bar Chart"
			});
			oContent1.setContent(this._oVizFrameKompl1);

			oChartContainer.removeAllContent();
			oChartContainer.addContent(oContent1);
			oChartContainer.updateChartContainer();
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

			//	toolPage.setSideExpanded(!toolPage.getSideExpanded());
			// setze auf immer geschlossen
			toolPage.setSideExpanded(false);
		},

		onExportToPDF: function() {
			MessageToast.show("Export Nach PDF. Noch nicht implementiert!");
		},

		initCustomFormat: function() {
			CustomerFormat.registerCustomFormat();
		},
		handleSelectionChangeLastschrift: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");

			if (oItem.getKey() === "1") {
				this.showZahlEingang();
			} else if (oItem.getKey() === "0") {
				this.showZahleinKompl();
			}

		},
		// simulate a refresh of the date that lasts 2 secs
		onRefresh: function() {
				var that = this;
				setTimeout(function() {
					that.getView().byId("pullToRefresh").hide();
					// hier call zum laden
				}, 1000);
			}
	});

});