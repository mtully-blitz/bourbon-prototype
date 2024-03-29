define(function(require, exports, module) {

var marionette = require('marionette');
var vent = require('built/app/vent').vent;
var modals = require('built/app/modals');
var activity = require('built/app/activity');
var keys = require('built/app/keys');


var MySampleView        = require('app/sample/views').MySampleView;
var MyModalView         = require('app/sample/views').MyModalView;
var BodyBorderView      = require('app/sample/views').BodyBorderView;
var Model               = require('backbone').Model;


var ApplicationDelegate = marionette.Controller.extend({

    initialize: function(options){
        // This call is required to initialize the
        // BUILT App foundation. See below for what's done.
        // You can customize that as necessary.
        this.BUILT();

        this.app = options.app;

        /* Ready. Set. Go! */
        // Your Application's Regions are set in the app/main.js
        // everything else starts here.
        //
        // You COULD set the regions here as well, but we left
        // it separated. Configuration in 1 place, Logic over
        // here. If you don't your regions in app/main, just
        // move that setup into this function.

        var model = new Model({
            message: 'Build something! Press Shift + M to display a Modal'
        });

        //this.app.window.show(new MySampleView({model: model}));
        this.app.window.show(new BodyBorderView({border: .03}));

        /* ---------- */
    },

    // Demo of handling Key Presses
    // Combined with Modal Handling
    keyDown: function(e){
        var key = keys.getKeyFromEvent(e);

        if(key == 'M' && // shift + M
           !this.app.modal.currentView){

            var complete = function(modalView){
                // Data from the modal:
                console.log(modalView.getData());

                // You are responsible for dismissing the modal.
                modals.dismissModal();
            };

            // Present a modal view.
            modals.presentModal(new MyModalView())
                  .then(complete);

            return true;
        }
    },

    BUILT: function(){

        // Key Management
        // If you are not using the modal system,
        // but are using the key system, you can omit
        // the dictionary passed here.
        keys.initialize({modals: modals});

        // The responder chain is a stack of views/controllers.
        // When a key event is detected, the stack is searched
        // from the bottom up. AKA Last in First Out (LIFO).
        // Views that participate in the chain can choose to implement
        // keyDown(e) or performKeyEquivalent(e).
        //
        // performKeyEquivalent is checked first then keyDown is checked.
        // If either of those returns 'true' the chain is no longer traversed.
        //
        // Note that we automatically add the ApplicationDelegate.
        // This ensures it will be the last one checked for key events.
        // Then we implement keyDown above to handle looking for
        // our desired key press.
        //
        // Any additional view or controller that would like
        // to participate in this chain is required to register
        // itself into the chain like we do here.
        keys.registerInResponderChain(this);

        // Modal Management
        // These handlers are present so you can define how the modal is
        // shown. AKA via animation, or some other means.
        //
        // You should NEVER call these directly.
        this.listenTo(vent, modals.events.PRESENT, this._presentModal);
        this.listenTo(vent, modals.events.DISMISS, this._dismissModal);

        // Activity Management
        // Like modal managerment, these handlers are present so you can define
        // how the network activity indicator is presented. AKA via animation
        // or some other means.
        //
        // You should NEVER call these directly.
        this.listenTo(vent, activity.events.PRESENT, this._presentNetworkActivityIndicator);
        this.listenTo(vent, activity.events.DISMISS, this._dismissNetworkActivityIndicator);
    },

    _presentNetworkActivityIndicator: function(){
        throw new Error('No Activity Indicator View Specified');
        //this.app.activity.show(new YourActivityView);
    },

    _dismissNetworkActivityIndicator: function(modalView){
        this.app.activity.close();
    },

    _presentModal: function(modalView){
        this.app.modal.show(modalView);
    },

    _dismissModal: function(modalView){
        this.app.modal.close();

        // This is VERY important!
        // You MUST call this after your
        // modal has been dismissed.
        modals.nextModal();
    }
});

exports.ApplicationDelegate = ApplicationDelegate;
});