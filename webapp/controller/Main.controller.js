sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/Dialog"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, Dialog) {
        "use strict";

        return Controller.extend("com.nttdata.tictactoe.controller.Main", {
            onInit: function () {
                this._newModel()
                var oViewModel = new JSONModel({
                    "player1": "Player 1 (N)",
                    "player2": "Player 2 (T)",
                    "mode": "P2P",
                    "total": 0,
                    "draw": 0,
                    "N": 0,
                    "T": 0
                });

                this.getView().setModel(oViewModel, "main");

            },
            /////////////////////////////////////////////////////////////
            //                                                         //
            //                   General Functions                     //
            //                                                         //
            /////////////////////////////////////////////////////////////

            onNewGame: function () {
                const winningConditions = [
                    ["/0/id", "/1/id", "/2/id"],
                    ["/3/id", "/4/id", "/5/id"],
                    ["/6/id", "/7/id", "/8/id"],
                    ["/0/id", "/3/id", "/6/id"],
                    ["/1/id", "/4/id", "/7/id"],
                    ["/2/id", "/5/id", "/8/id"],
                    ["/0/id", "/4/id", "/8/id"],
                    ["/2/id", "/4/id", "/6/id"]
                ];
                this._newModel()
                if (this._getProperty("/total", "main") % 2 === 0) {
                    MessageToast.show("Player 1 make first turn!");
                } else {
                    MessageToast.show("Player 2 make first turn!");
                }
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j <= 2; j++) {
                        var btnId = this._getProperty(winningConditions[i][j], "TNT")
                        this.getView().byId(btnId).removeStyleClass("darkblueButton")
                        this.getView().byId(btnId).removeStyleClass("greenButton")
                        this.getView().byId(btnId).removeStyleClass("redButton")
                        this.getView().byId(btnId).addStyleClass("blueButton")
                    }
                }
            },
            _setProperty: function (oValue, oProperty, oModel) {
                this.getView().getModel(oModel).setProperty(oValue, oProperty)
            },
            _getProperty: function (oProperty, oModel) {
                return this.getView().getModel(oModel).getProperty(oProperty);
            },
            _newModel: function () {
                var oViewModel = new JSONModel({
                    "0": {
                        "text": "",

                        "type": "Emphasized",
                        "id": "_IDGenButton1"
                    },
                    "1": {
                        "text": "",

                        "type": "Emphasized",
                        "id": "_IDGenButton2"
                    },
                    "2": {
                        "text": "",

                        "type": "Emphasized",
                        "id": "_IDGenButton3"
                    },
                    "3": {
                        "text": "",

                        "type": "Emphasized",
                        "id": "_IDGenButton4"
                    },
                    "4": {
                        "text": "",

                        "type": "Emphasized",
                        "id": "_IDGenButton5"
                    },
                    "5": {
                        "text": "",

                        "type": "Emphasized",
                        "id": "_IDGenButton6"
                    },
                    "6": {
                        "text": "",

                        "type": "Emphasized",
                        "id": "_IDGenButton7"
                    },
                    "7": {
                        "text": "",

                        "type": "Emphasized",
                        "id": "_IDGenButton8"
                    },
                    "8": {
                        "text": "",

                        "type": "Emphasized",
                        "id": "_IDGenButton9"
                    },
                    "counter": 0,
                    "winner": "",
                    "DATAText": {
                        "1": false,
                        "2": false,
                        "3": false
                    }
                });

                this.getView().setModel(oViewModel, "TNT");
            },
            onSuccessMessageDialogPress: function (winSet, winningConditions) {
                let winner = this._getProperty(winSet[0][0], "TNT")
                let btnId
                for (let i = 0; i <= 2; i++) {
                    btnId = this._getProperty(winSet[i][1], "TNT")
                    this.getView().byId(btnId).removeStyleClass("darkblueButton")
                    this.getView().byId(btnId).addStyleClass("greenButton")
                }
                this.oSuccessMessageDialog = new Dialog({
                    type: sap.m.DialogType.Message,
                    state: sap.ui.core.ValueState.Success,
                    content: new sap.m.Text({ text: "Grate! Player " + winner + " won!" }),
                    beginButton: new sap.m.Button({
                        type: sap.m.ButtonType.Emphasized,
                        text: "Rematch",
                        press: function () {
                            this.oSuccessMessageDialog.close();
                            this.onNewGame(winningConditions)
                            if(this._getProperty("/mode", "main") == '1P' && this._getProperty("/total", "main") % 2 === 1){
                                this._computerTurn(this._getProperty("/counter", "TNT"))
                            }
                        }.bind(this)
                    })
                });
                this.oSuccessMessageDialog.open();
            },
            onErrorMessageDialogPress: function (winSet, winningConditions) {
                let btnId
                for (let i = 0; i <= 2; i++) {
                    btnId = this._getProperty(winSet[i][1], "TNT")
                    this.getView().byId(btnId).removeStyleClass("darkblueButton")
                    this.getView().byId(btnId).addStyleClass("redButton")
                }

                this.oErrorMessageDialog = new Dialog({
                    type: sap.m.DialogType.Message,
                    state: sap.ui.core.ValueState.Error,
                    content: new sap.m.Text({ text: "Ops! Computer won!" }),
                    beginButton: new sap.m.Button({
                        type: sap.m.ButtonType.Emphasized,
                        text: "Rematch",
                        press: function () {
                            this.oErrorMessageDialog.close();
                            this.onNewGame(winningConditions)
                            if(this._getProperty("/mode", "main") == '1P' && this._getProperty("/total", "main") % 2 === 1){
                                this._computerTurn(this._getProperty("/counter", "TNT"))
                            }
                        }.bind(this)
                    })
                });

                this.oErrorMessageDialog.open();
            },
            onDefaultMessageDialogPress: function (winningConditions) {
                if (!this.oDefaultMessageDialog) {
                    this.oDefaultMessageDialog = new Dialog({
                        type: sap.m.DialogType.Message,
                        state: sap.ui.core.ValueState.Information,
                        content: new sap.m.Text({ text: "Grate! Draw. Frendship won!" }),
                        beginButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "Rematch",
                            press: function () {
                                this.oDefaultMessageDialog.close();
                                this.onNewGame(winningConditions)
                                if(this._getProperty("/mode", "main") == '1P' && this._getProperty("/total", "main") % 2 === 1){
                                    this._computerTurn(this._getProperty("/counter", "TNT"))
                                }
                            }.bind(this)
                        })
                    });
                }

                this.oDefaultMessageDialog.open();
            },
            checkIfDATAtext: function () {
                const winningConditions = [
                    [["/0/text", "/0/id"], ["/1/text", "/1/id"], ["/2/text", "/2/id"]],
                    [["/3/text", "/3/id"], ["/4/text", "/4/id"], ["/5/text", "/5/id"]],
                    [["/6/text", "/6/id"], ["/7/text", "/7/id"], ["/8/text", "/8/id"]],
                    [""]
                ];

                let btnId

                if (this._getProperty(winningConditions[0][0][0], "TNT") === "N" && this._getProperty(winningConditions[0][1][0], "TNT") === "T" && this._getProperty(winningConditions[0][2][0], "TNT") === "T") {
                    this._setProperty("/DATAText/1", true, "TNT")
                    winningConditions[3] = 0
                    for (let i = 0; i <= 2; i++) {
                        btnId = this._getProperty(winningConditions[winningConditions[3]][i][1], "TNT")
                        this.getView().byId(btnId).addStyleClass("darkblueButton")
                    }
                }
                if (this._getProperty(winningConditions[1][0][0], "TNT") === "N" && this._getProperty(winningConditions[1][1][0], "TNT") === "T" && this._getProperty(winningConditions[1][2][0], "TNT") === "T") {
                    this._setProperty("/DATAText/2", true, "TNT")
                    winningConditions[3] = 1
                    for (let i = 0; i <= 2; i++) {
                        btnId = this._getProperty(winningConditions[winningConditions[3]][i][1], "TNT")
                        this.getView().byId(btnId).addStyleClass("darkblueButton")
                    }
                }
                if (this._getProperty(winningConditions[2][0][0], "TNT") === "N" && this._getProperty(winningConditions[2][1][0], "TNT") === "T" && this._getProperty(winningConditions[2][2][0], "TNT") === "T") {
                    this._setProperty("/DATAText/3", true, "TNT")
                    winningConditions[3] = 2
                    for (let i = 0; i <= 2; i++) {
                        btnId = this._getProperty(winningConditions[winningConditions[3]][i][1], "TNT")
                        this.getView().byId(btnId).addStyleClass("darkblueButton")
                    }
                }
            },
            onP2PMod: function () {
                this.onNewGame()
                var oViewModel = new JSONModel({
                    "player1": "Player 1 (N)",
                    "player2": "Player 2 (T)",
                    "mode": "P2P",
                    "total": 0,
                    "draw": 0,
                    "N": 0,
                    "T": 0
                });

                this.getView().setModel(oViewModel, "main");
            },
            on1PMod: function () {
                this.onNewGame()
                var oViewModel = new JSONModel({
                    "player1": "Player 1 (N)",
                    "player2": "Computer (T)",
                    "mode": "1P",
                    "total": 0,
                    "draw": 0,
                    "N": 0,
                    "T": 0
                });

                this.getView().setModel(oViewModel, "main");
            },
            onPress: function (oEvent) {
                var oPath = oEvent.getSource().getBindingPath("text")
                if (this._getProperty(oPath, "TNT") === "") {
                    if (this._getProperty("/mode", "main") === "1P") {
                        this.onPress2(oEvent)
                    } else {
                        this.onPress1(oEvent)
                    }
                }
            },




            /////////////////////////////////////////////////////////////
            //                                                         //
            //                       2P2 Game                          //
            //                                                         //
            /////////////////////////////////////////////////////////////
            onPress1: function (oEvent) {
                var oValue = oEvent.getSource().getBindingPath("text");        //get value of pressed button
                var counter = this._getProperty("/counter", "TNT")
                if (this._getProperty("/total", "main") % 2 === 0) {              //get the counter
                    if (counter % 2 === 0) {                                       //depending on counter plaece N or T
                        this._setProperty(oValue, "N", "TNT")    //set N 
                    } else {
                        this._setProperty(oValue, "T", "TNT")    //set T
                    };
                } else {
                    if (counter % 2 === 0) {                                       //depending on counter plaece N or T
                        this._setProperty(oValue, "T", "TNT")    //set N 
                    } else {
                        this._setProperty(oValue, "N", "TNT")    //set T
                    };
                }
                counter++;
                this._setProperty("/counter", counter, "TNT")// set counter++
                this.checkIfDATAtext()
                this._validation(counter);                   //validation func
            },
            _validation: function (counter) {
                const winningConditions = [
                    [["/0/text", "/0/id"], ["/1/text", "/1/id"], ["/2/text", "/2/id"]],
                    [["/3/text", "/3/id"], ["/4/text", "/4/id"], ["/5/text", "/5/id"]],
                    [["/6/text", "/6/id"], ["/7/text", "/7/id"], ["/8/text", "/8/id"]],
                    [["/0/text", "/0/id"], ["/3/text", "/3/id"], ["/6/text", "/6/id"]],
                    [["/1/text", "/1/id"], ["/4/text", "/4/id"], ["/7/text", "/7/id"]],
                    [["/2/text", "/2/id"], ["/5/text", "/5/id"], ["/8/text", "/8/id"]],
                    [["/0/text", "/0/id"], ["/4/text", "/4/id"], ["/8/text", "/8/id"]],
                    [["/2/text", "/2/id"], ["/4/text", "/4/id"], ["/6/text", "/6/id"]]
                ];
                for (let i = 0; i < 8; i++) {
                    const winCondition = winningConditions[i];
                    let a = this._getProperty(winCondition[0][0], "TNT");
                    let b = this._getProperty(winCondition[1][0], "TNT");
                    let c = this._getProperty(winCondition[2][0], "TNT");

                    if (a === '' || b === '' || c === '') {
                        continue;
                    }
                    if (a === "N" && a === b && a === c) {
                        this.onSuccessMessageDialogPress(winningConditions[i], winningConditions)
                        let score = this._getProperty("/N", "main")
                        score++
                        this._setProperty("/N", score, "main")
                        let total = this._getProperty("/total", "main")
                        total++
                        this._setProperty("/total", total, "main")
                        this.getView().getModel("TNT").setProperty("/winner", "N")
                        break;
                    } else if (a === "T" && a === b && a === c) {
                        this.onSuccessMessageDialogPress(winningConditions[i])
                        let score = this._getProperty("/T", "main")
                        score++
                        this._setProperty("/T", score, "main")
                        let total = this._getProperty("/total", "main")
                        total++
                        this._setProperty("/total", total, "main")
                        this.getView().getModel("TNT").setProperty("/winner", "T")
                        break;
                    } else if (i == 7 && counter == 9 && this._getProperty("/winner", "TNT") == "") {
                        let score = this._getProperty("/draw", "main")
                        score++
                        this._setProperty("/draw", score, "main")
                        let total = this._getProperty("/total", "main")
                        total++
                        this._setProperty("/total", total, "main")
                        this.onDefaultMessageDialogPress()
                        break;
                    }
                }
            },



            /////////////////////////////////////////////////////////////
            //                                                         //
            //                       1P Game                           //
            //                                                         //
            /////////////////////////////////////////////////////////////
            onPress2: function (oEvent) {
                var oValue = oEvent.getSource().getBindingPath("text");
                var counter = this._getProperty("/counter", "TNT");
                this._setProperty(oValue, "N", "TNT");
                counter++;
                this.checkIfDATAtext();
                this._validation2(counter);
                this._computerTurn(counter);

            },
            _computerTurn: function (counter) {
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

                if (counter < 9 && this._getProperty("/winner", "TNT") === "") {
                    for (let i = 0; i < 8; i++) {
                        const winCondition = winningConditions[i];
                        let a = this._getProperty(winCondition[0], "TNT");
                        let b = this._getProperty(winCondition[1], "TNT");
                        let c = this._getProperty(winCondition[2], "TNT");
                        if (a === "T" && a === c && b === "") {
                            this._setProperty(winCondition[1], "T", "TNT");
                            counter++;
                            this._setProperty("/counter", counter, "TNT");

                            this.checkIfDATAtext();
                            this._validation2(counter);
                            return counter;
                        } else if (a === "T" && a === b && c === "") {
                            this._setProperty(winCondition[2], "T", "TNT");
                            counter++
                            this._setProperty("/counter", counter, "TNT")

                            this.checkIfDATAtext();
                            this._validation2(counter);
                            return counter;
                        } else if (b === "T" && b === c && a === "") {
                            this._setProperty(winCondition[0], "T", "TNT")
                            counter++
                            this._setProperty("/counter", counter, "TNT")

                            this.checkIfDATAtext();
                            this._validation2(counter);
                            return counter;
                        }
                    }
                    for (let i = 0; i < 8; i++) {
                        const winCondition = winningConditions[i];
                        let a = this._getProperty(winCondition[0], "TNT");
                        let b = this._getProperty(winCondition[1], "TNT");
                        let c = this._getProperty(winCondition[2], "TNT");
                        if (a === "N" && a === c && b === "") {
                            this._setProperty(winCondition[1], "T", "TNT")
                            counter++
                            this._setProperty("/counter", counter, "TNT")

                            this.checkIfDATAtext();
                            this._validation2(counter);
                            return counter;
                        } else if (a === "N" && a === b && c === "") {
                            this._setProperty(winCondition[2], "T", "TNT")
                            counter++
                            this._setProperty("/counter", counter, "TNT")

                            this.checkIfDATAtext();
                            this._validation2(counter);
                            return counter;
                        } else if (b === "N" && b === c && a === "") {
                            this._setProperty(winCondition[0], "T", "TNT")
                            counter++
                            this._setProperty("/counter", counter, "TNT")

                            this.checkIfDATAtext();
                            this._validation2(counter);
                            return counter;
                        }
                    }
                    for (let i = 0; i < 8; i++) {
                        const winCondition = winningConditions[i];
                        let a = this._getProperty(winCondition[0], "TNT");
                        let b = this._getProperty(winCondition[1], "TNT");
                        let c = this._getProperty(winCondition[2], "TNT");
                        if (a === "T" && c === "" && b === "") {
                            this._setProperty(winCondition[1], "T", "TNT")
                            counter++
                            this._setProperty("/counter", counter, "TNT")

                            this.checkIfDATAtext();
                            this._validation2(counter);
                            return counter;
                        } else if (b === "T" && a === "" && c === "") {
                            this._setProperty(winCondition[2], "T", "TNT")
                            counter++
                            this._setProperty("/counter", counter, "TNT")

                            this.checkIfDATAtext();
                            this._validation2(counter);
                            return counter;
                        } else if (c === "T" && b === "" && a === "") {
                            this._setProperty(winCondition[0], "T", "TNT")
                            counter++
                            this._setProperty("/counter", counter, "TNT")

                            this.checkIfDATAtext();
                            this._validation2(counter);
                            return counter;
                        } if (i === 7) {
                            this._randomFill(winningConditions)
                            counter++
                            this._setProperty("/counter", counter, "TNT")

                            this.checkIfDATAtext();
                            this._validation(counter);
                            return counter;
                        }
                    }
                }

            },
            _randomFill: function (oItem) {
                let oi = Math.floor(Math.random() * 8)
                let oj = Math.floor(Math.random() * 3)
                if (this._getProperty(oItem[oi][oj], "TNT") === "") {
                    this._setProperty(oItem[oi][oj], "T", "TNT")
                } else {
                    this._randomFill(oItem)
                }
            },
            _validation2: function (counter) {
                const winningConditions = [
                    [["/0/text", "/0/id"], ["/1/text", "/1/id"], ["/2/text", "/2/id"]],
                    [["/3/text", "/3/id"], ["/4/text", "/4/id"], ["/5/text", "/5/id"]],
                    [["/6/text", "/6/id"], ["/7/text", "/7/id"], ["/8/text", "/8/id"]],
                    [["/0/text", "/0/id"], ["/3/text", "/3/id"], ["/6/text", "/6/id"]],
                    [["/1/text", "/1/id"], ["/4/text", "/4/id"], ["/7/text", "/7/id"]],
                    [["/2/text", "/2/id"], ["/5/text", "/5/id"], ["/8/text", "/8/id"]],
                    [["/0/text", "/0/id"], ["/4/text", "/4/id"], ["/8/text", "/8/id"]],
                    [["/2/text", "/2/id"], ["/4/text", "/4/id"], ["/6/text", "/6/id"]]
                ];
                for (let i = 0; i < 8; i++) {
                    const winCondition = winningConditions[i];
                    let a = this._getProperty(winCondition[0][0], "TNT");
                    let b = this._getProperty(winCondition[1][0], "TNT");
                    let c = this._getProperty(winCondition[2][0], "TNT");

                    if (a === '' || b === '' || c === '') {
                        continue;
                    }
                    if (a === "N" && a === b && a === c) {
                        this.onSuccessMessageDialogPress(winningConditions[i])
                        let score = this._getProperty("/N", "main")
                        score++
                        this._setProperty("/N", score, "main")
                        let total = this._getProperty("/total", "main")
                        total++
                        this._setProperty("/total", total, "main")
                        this.getView().getModel("TNT").setProperty("/winner", "N")
                        break;
                    } else if (a === "T" && a === b && a === c) {
                        this.onErrorMessageDialogPress(winningConditions[i])
                        let score = this._getProperty("/T", "main")
                        score++
                        this._setProperty("/T", score, "main")
                        let total = this._getProperty("/total", "main")
                        total++
                        this._setProperty("/total", total, "main")
                        this.getView().getModel("TNT").setProperty("/winner", "T")
                        break;
                    } else if (i == 7 && counter == 9 && this._getProperty("/winner", "TNT") == "") {
                        let score = this._getProperty("/draw", "main")
                        score++
                        this._setProperty("/draw", score, "main")
                        let total = this._getProperty("/total", "main")
                        total++
                        this._setProperty("/total", total, "main")
                        this.onDefaultMessageDialogPress()
                        break;
                    }
                }
            }
        });
    });