sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, Fragment) {
        "use strict";

        return Controller.extend("com.nttdata.tictactoe.controller.Test", {
            onInit: function () {
                this._newModel()
            },
            onPress: function (oEvent) {
                var oValue = oEvent.getSource().getBindingPath("text");        //get num of pressed button
                var oEnable = oEvent.getSource().getBindingPath("enabled");
                var counter = this._getProperty("/counter")                                         //depending on count plaece N or T
                this.getView().getModel("TNT").setProperty(oValue, "N")       //set N or T 
                this.getView().getModel("TNT").setProperty(oEnable, false)
                counter++;
                //validation func
                this._validation(counter);
                this._computerTurn(counter)
                this._validation(counter);

            },
            onRefresh: function () {
                this.byId("hDialog").close();
                this._newModel()
                MessageToast.show("Make first turn!");
            },
            onRefresh2: function () {
                this._newModel()
                MessageToast.show("Make first turn!");
            },
            onOpenDialog: function (oWinner) {
                // create dialog lazily
                this.getView().getModel("TNT").setProperty("/winner", oWinner)
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "com.nttdata.tictactoe.view.TheEnd"
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },
            onP2PMod: function () {
                this._newModel()
                this.getOwnerComponent().getRouter().navTo("main");

            },
            on1PMod: function (oEvent) {
                this._newModel()
                this.getOwnerComponent().getRouter().navTo("1p");
            },
            _validation: function (counter) {
                const winningConditions = [
                    ["/0/text", "/1/text", "/2/text"],
                    ["/3/text", "/4/text", "/5/text"],
                    ["/6/text", "/7/text", "/8/text"],
                    ["/0/text", "/3/text", "/6/text"],
                    ["/1/text", "/4/text", "/7/text"],
                    ["/2/text", "/5/text", "/8/text"],
                    ["/0/text", "/4/text", "/8/text"],
                    ["/2/text", "/4/text", "/6/text"]
                ];
                for (let i = 0; i < 8; i++) {
                    const winCondition = winningConditions[i];
                    let a = this._getProperty(winCondition[0]);
                    let b = this._getProperty(winCondition[1]);
                    let c = this._getProperty(winCondition[2]);

                    if (a === "" || b === "" || c === "") {
                        continue;
                    }
                    if (a === b && a === c) {
                        this.onOpenDialog("Player " + a);
                    }
                }
            },
            _computerTurn: function (counter) {
                const winningConditions = [
                    [["/0/text", "/0/enabled"], ["/1/text", "/1/enabled"], ["/2/text", "/2/enabled"]],
                    [["/3/text", "/3/enabled"], ["/4/text", "/4/enabled"], ["/5/text", "/5/enabled"]],
                    [["/6/text", "/6/enabled"], ["/7/text", "/7/enabled"], ["/8/text", "/8/enabled"]],
                    [["/0/text", "/0/enabled"], ["/3/text", "/3/enabled"], ["/6/text", "/6/enabled"]],
                    [["/1/text", "/1/enabled"], ["/4/text", "/4/enabled"], ["/7/text", "/7/enabled"]],
                    [["/2/text", "/2/enabled"], ["/5/text", "/5/enabled"], ["/8/text", "/8/enabled"]],
                    [["/0/text", "/0/enabled"], ["/4/text", "/4/enabled"], ["/8/text", "/8/enabled"]],
                    [["/2/text", "/2/enabled"], ["/4/text", "/4/enabled"], ["/6/text", "/6/enabled"]]
                ];

                if (counter < 9 && this._getProperty("/winner") === "") {
                    for (let i = 0; i < 8; i++) {
                        const winCondition = winningConditions[i];
                        let a = this._getProperty(winCondition[0][0]);
                        let b = this._getProperty(winCondition[1][0]);
                        let c = this._getProperty(winCondition[2][0]);
                        if (a === "T" && a === c && b === "") {
                            this._setProperty(winCondition[1][0], "T")
                            this._setProperty(winCondition[1][1], false)
                            counter++
                            this._setProperty("/counter", counter)
                            return counter;
                        } else if (a === "T" && a === b && c === "") {
                            this._setProperty(winCondition[2][0], "T")
                            this._setProperty(winCondition[2][1], false)
                            counter++
                            this._setProperty("/counter", counter)
                            return counter;
                        } else if (b === "T" && b === c && a === "") {
                            this._setProperty(winCondition[0][0], "T")
                            this._setProperty(winCondition[0][1], false)
                            counter++
                            this._setProperty("/counter", counter)
                            return counter;
                        }
                    }
                    for (let i = 0; i < 8; i++) {
                        const winCondition = winningConditions[i];
                        let a = this._getProperty(winCondition[0][0]);
                        let b = this._getProperty(winCondition[1][0]);
                        let c = this._getProperty(winCondition[2][0]);
                        if (a === "N" && a === c && b === "") {
                            this._setProperty(winCondition[1][0], "T")
                            this._setProperty(winCondition[1][1], false)
                            counter++
                            this._setProperty("/counter", counter)
                            return counter;
                        } else if (a === "N" && a === b && c === "") {
                            this._setProperty(winCondition[2][0], "T")
                            this._setProperty(winCondition[2][1], false)
                            counter++
                            this._setProperty("/counter", counter)
                            return counter;
                        } else if (b === "N" && b === c && a === "") {
                            this._setProperty(winCondition[0][0], "T")
                            this._setProperty(winCondition[0][1], false)
                            counter++
                            this._setProperty("/counter", counter)
                            return counter;
                        }
                    }
                    for (let i = 0; i < 8; i++) {
                        const winCondition = winningConditions[i];
                        let a = this._getProperty(winCondition[0][0]);
                        let b = this._getProperty(winCondition[1][0]);
                        let c = this._getProperty(winCondition[2][0]);
                        if (a === "T" && c === "" && b === "") {
                            this._setProperty(winCondition[1][0], "T")
                            this._setProperty(winCondition[1][1], false)
                            counter++
                            this._setProperty("/counter", counter)
                            return counter;
                        } else if (b === "T" && a === "" && c === "") {
                            this._setProperty(winCondition[2][0], "T")
                            this._setProperty(winCondition[2][1], false)
                            counter++
                            this._setProperty("/counter", counter)
                            return counter;
                        } else if (c === "T" && b === "" && a === "") {
                            this._setProperty(winCondition[0][0], "T")
                            this._setProperty(winCondition[0][1], false)
                            counter++
                            this._setProperty("/counter", counter)
                            return counter;
                        } if (i === 7) {
                            this._randomFill(winningConditions)
                            counter++
                            this._setProperty("/counter", counter)
                            return counter;
                        }
                    }
                } else this.onOpenDialog("Draw. Frendship");

            },
            _randomFill: function (oItem) {
                let oi = Math.floor(Math.random() * 8)
                let oj = Math.floor(Math.random() * 3)
                if (this._getProperty(oItem[oi][oj][0]) === "") {
                    this._setProperty(oItem[oi][oj][0], "T")
                    this._setProperty(oItem[oi][oj][1], false)
                } else {
                    this._randomFill(oItem)
                }
            },
            _setProperty: function (oValue, oProperty) {
                this.getView().getModel("TNT").setProperty(oValue, oProperty)
            },
            _getProperty: function (oProperty) {
                return this.getView().getModel("TNT").getProperty(oProperty);
            },
            _newModel: function () {
                var oViewModel = new JSONModel({
                    "0": {
                        "text": "",
                        "enabled": true,
                        "type": "Emphasized"
                    },
                    "1": {
                        "text": "",
                        "enabled": true,
                        "type": "Emphasized"
                    },
                    "2": {
                        "text": "",
                        "enabled": true,
                        "type": "Emphasized"
                    },
                    "3": {
                        "text": "",
                        "enabled": true,
                        "type": "Emphasized"
                    },
                    "4": {
                        "text": "",
                        "enabled": true,
                        "type": "Emphasized"
                    },
                    "5": {
                        "text": "",
                        "enabled": true,
                        "type": "Emphasized"
                    },
                    "6": {
                        "text": "",
                        "enabled": true,
                        "type": "Emphasized"
                    },
                    "7": {
                        "text": "",
                        "enabled": true,
                        "type": "Emphasized"
                    },
                    "8": {
                        "text": "",
                        "enabled": true,
                        "type": "Emphasized"
                    },
                    "counter": 0,
                    "winner": "",
                    "mods": {
                        "p2p": false,
                        "p2pEnabled": true,
                        "1p": true,
                        "1pEnabled": false,
                    }
                });

                this.getView().setModel(oViewModel, "TNT");
            }
        });
    });
