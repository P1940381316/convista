sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../sonstiges/CustomerFormat",
	"sap/m/MessageToast"
], function(jQuery, Controller, JSONModel, CustomerFormat, MessageToast) {
	"use strict";

	return Controller.extend("com.convista.controller.Main", {
		modelNavi: new sap.ui.model.json.JSONModel("model/Basiscs.json"),

		oVizFrame: null,
		oVizFrameBarLine: null,
		oVizFrameBarLineRueck: null,

		onInit: function() {

			this.getView().setModel(this.modelNavi);
			this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);
			this.initCustomFormat();

			this.onSideNavButtonPress();
			this.initializeKompl();
			this.showZahleinKompl();

			this.initializeLSVLastschrift("Aktuell");
			this.showLSVLastschrift();

			this.initializeRefusal("Aktuell");
			this.showRefusal();

			this.initializeKlaer("Aktuell");
			this.showKlaer();

			//Hide Settings Panel for phone
			if (sap.ui.Device.system.phone) {
				this.getView().byId("settingsPanel").setExpanded(false);
			}
		},

		generateVizFrame: function() {
			var oVizFrameKompl1;
			// Stacked bar chart vizframe
			oVizFrameKompl1 = new sap.viz.ui5.controls.VizFrame({
				height: "100%",
				width: "100%",
				uiConfig: {
					applicationSet: "fiori"
				},
				vizProperties: {
					plotArea: {
						dataLabel: {
							formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
							visible: true
						},
						dataShape: {
							primaryAxis: ["line", "bar", "bar"]
						}
					},

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
						label: {
							formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_2
						},
						title: {

							"visible": false
						}
					}
				}
			});
			return oVizFrameKompl1;
		},

		/**
		 * ab hier Eingangsarten Lastschrift, Kreditkarte , etc.
		 */

		initializeEingansArt: function(paymentArt) {
			var oVizFrameEingang = this.generateVizFrame();

			var oModelEingang = new JSONModel("model/LineEingangs.json");
			oModelEingang.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);

			var oDatasetEingang = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: "month",
					value: "{month}"
				}],
				measures: [{
					name: paymentArt,
					value: "{payValue}"
				}],
				data: {
					path: "/paymentprocedure/" + paymentArt
				}
			});

			var oFeedPrimaryValuesEing = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: [paymentArt]
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
			oVizFrameKompl1 = this.generateVizFrame();

			oModelKompl1 = new sap.ui.model.json.JSONModel("model/LineEingangsKomplett.json");
			var panelKompl = this.getView().byId("panelKompl");
			panelKompl.setModel(oModelKompl1);
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
					path: "/Umsatz/paymentprocedure"
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
			oVizFrameKompl1.addFeed(
				oFeedPrimaryValuesKompl1);
			oVizFrameKompl1.addFeed(oFeedPrimaryValuesKompl2);
			oVizFrameKompl1.addFeed(oFeedPrimaryValuesKompl3);
			oVizFrameKompl1
				.addFeed(oFeedPrimaryValuesKompl4);
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
		// ab hier Bar Line Chart Lastschrift
		initializeLSVLastschrift: function(timeRange) {
			//	var timeRange = "Aktuell";
			var oVizFrameLSVLastSchrift = this.generateVizFrame();
			var dataModelLSVLast = new JSONModel("model/BarLineLastschrift.json");
			dataModelLSVLast.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			var panelLSVLast = this.getView().byId("panelDebitEntry");
			panelLSVLast.setModel(dataModelLSVLast);
			panelLSVLast.bindElement("/" + timeRange);
			var oDatasetLSVLast;
			if (timeRange === "Aktuell") {
				oDatasetLSVLast = new sap.viz.ui5.data.FlattenedDataset({
					dimensions: [{
						name: "month",
						value: "{month}"
					}],
					measures: [{
						name: "Anzahl Lastschrift",
						value: "{anzahlLastschrift}"
					}, {
						name: "Volumen Lastschrift",
						value: "{volumenLastschrift}"
					}],
					data: {
						path: "/" + timeRange + "/Lastschrift"
					}
				});
			} else {
				oDatasetLSVLast = new sap.viz.ui5.data.FlattenedDataset({
					dimensions: [{
						name: "month",
						value: "{month}"
					}],
					measures: [{
						name: "Volumen Lastschrift",
						value: "{volumenLastschrift}"
					}, {
						name: "Anzahl Lastschrift",
						value: "{anzahlLastschrift}"
					}, {
						name: "Anzahl Lastschrift " + timeRange,
						value: "{anzahlLastschriftEqual}"
					}],
					data: {
						path: "/" + timeRange + "/Lastschrift"
					}
				});
			}

			var oFeedPrimaryValuesEing2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: "Anzahl Lastschrift"
			});

			var oFeedPrimaryValuesEing1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: "Volumen Lastschrift"
			});

			var oFeedAxisLabelsEing = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "categoryAxis",
				type: "Dimension",
				values: "month"
			});
			var oFeedPrimaryValuesEing3;

			//jQuery.sap.log.error("timeRange: " + timeRange);

			if (timeRange !== "Aktuell") {
				oFeedPrimaryValuesEing3 = new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid: "valueAxis",
					type: "Measure",
					values: "Anzahl Lastschrift " + timeRange
				});
			}
			oVizFrameLSVLastSchrift.setDataset(oDatasetLSVLast);
			oVizFrameLSVLastSchrift.setModel(dataModelLSVLast);
			oVizFrameLSVLastSchrift.addFeed(oFeedPrimaryValuesEing1);
			oVizFrameLSVLastSchrift.addFeed(oFeedPrimaryValuesEing2);

			if (timeRange !== "Aktuell") {
				oVizFrameLSVLastSchrift.addFeed(oFeedPrimaryValuesEing3);
			}

			oVizFrameLSVLastSchrift.addFeed(oFeedAxisLabelsEing);
			oVizFrameLSVLastSchrift.setVizType("combination");
			this._oVizFrameLSVLastschrift = oVizFrameLSVLastSchrift;

			var oPopOverBarLine = this.getView().byId("idPopOverLast");
			oPopOverBarLine.connect(oVizFrameLSVLastSchrift.getVizUid());
			oPopOverBarLine.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);

		},
		/** 
		 * hier die Anzeige des Lastschrift Charts
		 */
		showLSVLastschrift: function() {
			var oChartContainer,
				oContent1;

			oChartContainer = this.getView().byId("idCombinedChartContainerLast");
			oContent1 = new sap.suite.ui.commons.ChartContainerContent({
				icon: "sap-icon://column-chart-dual-axis",
				title: "Combined Chart"
			});
			oContent1.setContent(this._oVizFrameLSVLastschrift);
			oChartContainer.removeAllContent();
			oChartContainer.addContent(oContent1);
			oChartContainer.updateChartContainer();
		},

		// ab hier Bar Line Chart Rückläufer
		initializeRefusal: function(timeRange) {
			//	var timeRange = "Aktuell";
			var oVizFrameRefusal = this.generateVizFrame();
			var dataModelRefusal = new JSONModel("model/BarLineRuecklaeufer.json");
			dataModelRefusal.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			var panelRefusal = this.getView().byId("panelRefusal");
			panelRefusal.setModel(dataModelRefusal);
			panelRefusal.bindElement("/" + timeRange);

			var sLabelVergleich =  "Anzahl Rücklastschrift " + timeRange;
			var oDatasetRefusal = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: "month",
					value: "{month}"
				}],
				measures: [
					{
					name: "Volumen Rücklastschrift",
					value: "{volumenRücklastschrift}"
				},{
					name: "Anzahl Rücklastschrift",
					value: "{anzahlRücklastschrift}"
				}, {
					name: sLabelVergleich,
					value: "{anzahlRücklastschriftEqual}"
				}],
				data: {
					path: "/" + timeRange + "/Rückläufer"
				}
			});

			var oFeedPrimaryValuesEing2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: "Anzahl Rücklastschrift"
			});

			var oFeedPrimaryValuesEing1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: "Volumen Rücklastschrift"
			});

			var oFeedAxisLabelsEing = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "categoryAxis",
				type: "Dimension",
				values: "month"
			});
			var oFeedPrimaryValuesEing3;
			if (timeRange !== "Aktuell") {

				oFeedPrimaryValuesEing3 = new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid: "valueAxis",
					type: "Measure",
					values: sLabelVergleich
				});
			}

			oVizFrameRefusal.setDataset(oDatasetRefusal);
			oVizFrameRefusal.setModel(dataModelRefusal);
			oVizFrameRefusal.addFeed(oFeedPrimaryValuesEing1);
			oVizFrameRefusal.addFeed(oFeedPrimaryValuesEing2);
			if (timeRange !== "Aktuell") {
				oVizFrameRefusal.addFeed(oFeedPrimaryValuesEing3);
			}

			oVizFrameRefusal.addFeed(oFeedAxisLabelsEing);
			oVizFrameRefusal.setVizType("combination");
			this._oVizFrameRefusal = oVizFrameRefusal;
			
			var oPopOverBarLine = this.getView().byId("idPopOverRueck");
			oPopOverBarLine.connect(oVizFrameRefusal.getVizUid());
			oPopOverBarLine.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
			
		},

		showRefusal: function() {
			var oChartContainer,
				oContent1;

			oChartContainer = this.getView().byId("idChartContainerRueck");
			oContent1 = new sap.suite.ui.commons.ChartContainerContent({
				icon: "sap-icon://column-chart-dual-axis",
				title: "Combined Chart"
			});
			oContent1.setContent(this._oVizFrameRefusal);
			oChartContainer.removeAllContent();
			oChartContainer.addContent(oContent1);
			oChartContainer.updateChartContainer();
		},

		// ab hier Bar Line Chart Rückläufer
		initializeKlaer: function(timeRange) {
			//	var timeRange = "Aktuell";
			var oVizFrameKlaer = this.generateVizFrame();
			var dataModelKlaer = new JSONModel("model/BarLineKlaerbestand.json");
			dataModelKlaer.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			var panelKlaer = this.getView().byId("panelKlaer");
			panelKlaer.setModel(dataModelKlaer);
			panelKlaer.bindElement("/" + timeRange);

		var sLabelVergleich =  "Anzahl Klärbestand " + timeRange;
			var oDatasetKlaer = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: "month",
					value: "{month}"
				}],
				measures: [{
					name: "Volumen Klärbestand",
					value: "{volumenKlaerbestand}"
				}, {
					name: "Anzahl Klärbestand",
					value: "{anzahlKlaerbestand}"
				}, {
					name: sLabelVergleich,
					value: "{anzahlKlaerbestandEqual}"
				}],
				data: {
					path: "/" + timeRange + "/Klärbestand"
				}
			});

			var oFeedPrimaryValuesEing2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: "Anzahl Klärbestand"
			});

			var oFeedPrimaryValuesEing3 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: sLabelVergleich
			});

			var oFeedPrimaryValuesEing1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "valueAxis",
				type: "Measure",
				values: "Volumen Klärbestand"
			});

			var oFeedAxisLabelsEing = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "categoryAxis",
				type: "Dimension",
				values: "month"
			});

			oVizFrameKlaer.setDataset(oDatasetKlaer);
			oVizFrameKlaer.setModel(dataModelKlaer);
			oVizFrameKlaer.addFeed(oFeedPrimaryValuesEing1);
			oVizFrameKlaer.addFeed(oFeedPrimaryValuesEing2);
			
			if (timeRange !== "Aktuell") {
				oVizFrameKlaer.addFeed(oFeedPrimaryValuesEing3);
			}
			
			oVizFrameKlaer.addFeed(oFeedAxisLabelsEing);
			oVizFrameKlaer.setVizType("combination");
			this._oVizFrameKlaer = oVizFrameKlaer;

			var oPopOverBarLine = this.getView().byId("idPopOverKlaer");
			oPopOverBarLine.connect(oVizFrameKlaer.getVizUid());
			oPopOverBarLine.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);

		},

		showKlaer: function() {
			var oChartContainer,
				oContent1;

			oChartContainer = this.getView().byId("idChartContainerKlaer");
			oContent1 = new sap.suite.ui.commons.ChartContainerContent({
				icon: "sap-icon://column-chart-dual-axis",
				title: "Combined Chart"
			});
			oContent1.setContent(this._oVizFrameKlaer);
			oChartContainer.removeAllContent();
			oChartContainer.addContent(oContent1);
			oChartContainer.updateChartContainer();
		},

		/** vermutlich nicht mehr benötigt  */
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

		handleSelectionChangeZahleingang: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			jQuery.sap.log.error("selectedItem: " + oItem.getText());
			if (oItem.getKey() !== "0") {
				this.initializeEingansArt(oItem.getText());
				this.showZahlEingang();
			} else if (oItem.getKey() === "0") {
				this.showZahleinKompl();
			}
		},

		handleSelectionChangeLSVLast: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");

			this.initializeLSVLastschrift(oItem.getText());
			this.showLSVLastschrift();

		},

		handleSelectionChangeRueck: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			this.initializeRefusal(oItem.getText());
			this.showRefusal();
		},
		handleSelectionChangeKlaer: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			this.initializeKlaer(oItem.getText());
			this.showKlaer();
		},
		// simulate a refresh of the date that lasts 2 secs
		onRefresh: function() {
			var that = this;
			setTimeout(function() {
				that.getView().byId("pullToRefresh").hide();
				// hier call zum laden
			}, 1000);
		},
		number1formater: function(value1) {
			var oNumerFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});
			//return CustomerFormat.FIORI_LABEL_FORMAT_2.format(value1);
			return oNumerFormat.format(value1);
		}
	});

});