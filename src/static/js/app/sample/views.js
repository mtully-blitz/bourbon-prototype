define(function(require, exports, module) {

var marionette = require('marionette');
var modals = require('built/app/modals');

var templateSample = require('hbs!app/sample/templates/sample');
var templateModal = require('hbs!app/sample/templates/modal');

var MySampleView = marionette.ItemView.extend({
    template: templateSample
});


var MyModalView = marionette.ItemView.extend({
    template: templateModal,

    events:{
        'click .actions .btn.close': 'wantsCloseModal'
    },

    // Required Method
    // Enables you to pass any information from this
    // modal view to the thing that cares about it.
    //
    // This is your bridge.
    getData: function(){
        return {foo: 'foo', bar: 'bar'};
    },

    wantsCloseModal: function(){
        this.trigger(modals.events.COMPLETE);
    }
});

var BodyBorderView = marionette.ItemView.extend({
    
    el: $('body'),
    
    initialize: function(options) {
        this.options = options;
        _.defaults(this.options, this._getDefaults());
        
        // cache selectors
        this._theWindow = $(window);
        this._theWindowWidth = this._theWindow.width();
        this._wrapper = this.$el.find(this.options.wrapper);
        this._topBorder = this.$el.find(this.options.topBorder);
        this._bottomBorder = this.$el.find(this.options.bottomBorder);
        
        this.resizeBorder(this._theWindow.width());
        
        // bind to the namespaced (for easier unbinding) event
        $(window).on("resize.app", _.bind(this.resize, this));
    },
    
    remove: function() {
        // unbind the namespaced event (to prevent accidentally unbinding some
        // other resize events from other code in your app
        $(window).off("resize.app");

        // don't forget to call the original remove() function
        this.constructor.__super__.remove.call(this);
    },
    
    resize: function () {

        var winWidth = this._theWindow.width();
        
        // do nothing if the width is the same
        // don't care about vertical resize.
        if (winWidth == this._theWindowWidth){
            return;
        }else{
            // Store the width of the last resize and continue
            this._theWindowWidth = winWidth;
        }

        this.resizeBorder(winWidth);

    },
    
    resizeBorder: function(winWidth){
        
        // set margin width
        var newBorder = Math.floor(winWidth * this.options.border);
        
        // set minimum margin width
        if(newBorder <= this.options.borderMin) {
            newBorder = this.options.borderMin;
        }
        
        // Update css to set borders
        this._wrapper.css({margin: newBorder+'px'});
        this._topBorder.css({height: newBorder+'px'});
        this._bottomBorder.css({height: newBorder+'px'});

    },
    
    // Helpers

    _getDefaults: function() {
        return {
            wrapper: '#wrapper',
            topBorder: '#border-top',
            bottomBorder: '#border-bottom',
            border: 0.05, //5%
            borderMin: 20,
        };
    },
});

exports.MySampleView = MySampleView;
exports.MyModalView = MyModalView;
exports.BodyBorderView = BodyBorderView;

});