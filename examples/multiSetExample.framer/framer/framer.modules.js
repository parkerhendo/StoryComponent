require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"StoryComponent":[function(require,module,exports){

/*
	 * Story Component

	 * Example usage
	{StoryComponent} = require "StoryComponent"
	exampleSet = new StoryComponent
		progressBarHorizontalPadding: 12
		progressBarVerticalPadding: 12
		progressBarHeight: 4
		progressBarGradient: true
		timePerStory: 3
		stories: [ "images/1.png", "images/2.png", "images/3.png" ]

	 * Listen for story completion event
	example._endOfUpdatesEvent.on "change:x", ->
		if example._endOfUpdatesEvent.x == 1

	 * Start story playback
	example._startStoriesPlayback()

	 * Stop story playback
	example._stopStoriesPlayback()
	
	 * Reset story playback
	example._resetStoriesPlayback()
 */
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.StoryComponent = (function(superClass) {
  extend(StoryComponent, superClass);

  function StoryComponent(options1) {
    var options;
    this.options = options1 != null ? options1 : {};
    this._setupLayout = bind(this._setupLayout, this);
    options = _.defaults(this.options, {
      progressBarHorizontalPadding: 12,
      progressBarVerticalPadding: 12,
      progressBarHeight: 4,
      progressBarGradient: true,
      timePerStory: 3,
      stories: [""]
    });
    StoryComponent.__super__.constructor.call(this, this.options);
    this._numberOfUpdates = this.options.stories.length;
    this._totalTime = this._numberOfUpdates * this.options.timePerStory;
    this._setupLayout();
  }

  StoryComponent.prototype._setupLayout = function() {
    var authorStoryHolder, currentStoryOfAuthor, i, longPress, number, numberOfUpdates, progressBarHolderForLoop, progressBarHolderInitialSectionWidthForLoop, progressBarHolderInitialWidth, ref, timePerStory;
    longPress = false;
    currentStoryOfAuthor = 1;
    timePerStory = this.options.timePerStory;
    numberOfUpdates = this.options.stories.length;
    this._storiesContainer = new Layer({
      backgroundColor: "#292929",
      width: Screen.width,
      height: Screen.height,
      name: "Stories Container",
      parent: this,
      clip: true
    });
    this._nextHit = new Layer({
      width: Screen.width / 1.5,
      height: Screen.height,
      x: Align.right,
      backgroundColor: "rgba(0,0,0,0)",
      name: "Next hit",
      parent: this._storiesContainer
    });
    this._backHit = new Layer({
      width: Screen.width / 3,
      height: Screen.height,
      x: Align.left,
      backgroundColor: "rgba(0,0,0,0)",
      name: "Back hit",
      parent: this._storiesContainer
    });
    this._endOfUpdatesEvent = new Layer({
      width: 1,
      height: 1,
      x: 0,
      y: 0,
      backgroundColor: "rgba(0,0,0,0)",
      name: "Variable Holder",
      parent: this._storiesContainer
    });
    this._progressBarHolderInitialWidth = Screen.width - (this.options.progressBarHorizontalPadding * 2);
    this._progressBarHolderInitialSectionWidth = this._progressBarHolderInitialWidth / this._numberOfUpdates;
    this._progressBarHolder = new Layer({
      height: this.options.progressBarHeight,
      width: this._progressBarHolderInitialWidth,
      x: Align.center,
      y: this.options.progressBarVerticalPadding,
      backgroundColor: "#00ffffff",
      name: "Progress Bar Holder",
      parent: this._storiesContainer
    });
    this._authorStoryHolder = new Layer({
      width: Screen.width * this._numberOfUpdates,
      height: Screen.height,
      name: "Auther's Stories Holder",
      parent: this._storiesContainer
    });
    this._authorStoryHolder.placeBehind(this._progressBarHolder);
    authorStoryHolder = this._authorStoryHolder;
    progressBarHolderInitialWidth = this._progressBarHolderInitialWidth;
    progressBarHolderForLoop = this._progressBarHolder;
    progressBarHolderInitialSectionWidthForLoop = this._progressBarHolderInitialSectionWidth;
    this._progressBarHolder.onChange("width", function() {
      var authorProgress, i, number, ref, results;
      authorProgress = Utils.modulate(this.width, [0, progressBarHolderInitialWidth], [0, 1]);
      results = [];
      for (number = i = 0, ref = numberOfUpdates; 0 <= ref ? i < ref : i > ref; number = 0 <= ref ? ++i : --i) {
        if ((progressBarHolderForLoop.width < (progressBarHolderInitialWidth * (number + 1))) && (progressBarHolderForLoop.width > (progressBarHolderInitialSectionWidthForLoop * number))) {
          currentStoryOfAuthor = number + 1;
          results.push(authorStoryHolder.x = -Screen.width * number);
        } else {
          results.push(void 0);
        }
      }
      return results;
    });
    if (this._numberOfUpdates > 1) {
      numberOfUpdates = this._numberOfUpdates;
      for (number = i = 0, ref = numberOfUpdates; 0 <= ref ? i < ref : i > ref; number = 0 <= ref ? ++i : --i) {
        this._story = new Layer({
          backgroundColor: Utils.randomColor(),
          image: this.options.stories[number],
          width: Screen.width,
          height: Screen.height,
          x: Screen.width * number,
          parent: this._authorStoryHolder
        });
        this._story.name = "Story " + (number + 1);
        this._progressBarSection = new Layer({
          backgroundColor: "#ffffff",
          height: this.options.progressBarHeight,
          width: (this._progressBarHolder.width - this.options.progressBarHorizontalPadding) / this._numberOfUpdates,
          x: number * ((this._progressBarHolder.width / this._numberOfUpdates) + ((this.options.progressBarHorizontalPadding / 2) / this._numberOfUpdates)),
          borderRadius: this.options.progressBarHeight,
          parent: this._progressBarHolder
        });
        this._progressBarSection.name = "Progress Bar Section " + number;
      }
    } else {
      this._story1 = new Layer({
        backgroundColor: Utils.randomColor(),
        image: this.options.stories[0],
        width: Screen.width,
        height: Screen.height,
        x: 0,
        parent: this._authorStoryHolder,
        name: "Story"
      });
      this._progressBarSection1 = new Layer({
        backgroundColor: "#ffffff",
        height: this.options.progressBarHeight,
        width: this._progressBarHolder.width,
        x: Align.left,
        borderRadius: this.options.progressBarHeight,
        parent: this._progressBarHolder
      });
    }
    this._progressBarHolderBG = this._progressBarHolder.copy();
    this._progressBarHolderBG.name = "Progress Bar Holder Background";
    this._progressBarHolderBG.opacity = 0.25;
    this._progressBarHolderBG.parent = this._storiesContainer;
    if (this.options.progressBarGradient === true) {
      this._progressBarBackgroundGradient = new Layer({
        width: Screen.width,
        height: (this.options.progressBarVerticalPadding * 2) + (this.options.progressBarHeight + 4),
        gradient: {
          start: "rgba(0,0,0,0)",
          end: "rgba(0,0,0,0.3)"
        },
        name: "Progress Bar Gradient",
        parent: this._storiesContainer
      });
    }
    this._progressBarHolderBG.bringToFront();
    this._progressBarHolder.bringToFront();
    this._progressBarHolder.clip = true;
    this._progressBarHolder.width = 0;
    this._nextHit.onTouchStart((function(_this) {
      return function() {
        return _this._stopStoriesPlayback();
      };
    })(this));
    this._backHit.onTouchStart((function(_this) {
      return function() {
        return _this._stopStoriesPlayback();
      };
    })(this));
    this._nextHit.progressBarHolder = this._progressBarHolder;
    this._nextHit.progressBarHolderBG = this._progressBarHolderBG;
    this._nextHit.numberOfUpdates = this._numberOfUpdates;
    this._backHit.progressBarHolder = this._progressBarHolder;
    this._backHit.progressBarHolderBG = this._progressBarHolderBG;
    this._backHit.numberOfUpdates = this._numberOfUpdates;
    this._nextHit.onTouchEnd((function(_this) {
      return function() {
        if (longPress === false) {
          _this._progressBarHolder.width = (_this._progressBarHolderBG.width / numberOfUpdates) * currentStoryOfAuthor;
          currentStoryOfAuthor++;
          if (currentStoryOfAuthor >= numberOfUpdates) {
            currentStoryOfAuthor = currentStoryOfAuthor;
          }
          _this._totalTime = (numberOfUpdates - (currentStoryOfAuthor - 1)) * timePerStory;
          return _this._startStoriesPlayback();
        } else {
          _this._startStoriesPlayback();
          return longPress = false;
        }
      };
    })(this));
    this._backHit.onTouchEnd((function(_this) {
      return function() {
        if (longPress === false) {
          if (currentStoryOfAuthor > 1) {
            _this._progressBarHolder.width = (_this._progressBarHolderBG.width / numberOfUpdates) * (currentStoryOfAuthor - 2);
          }
          currentStoryOfAuthor--;
          if (currentStoryOfAuthor < 1) {
            currentStoryOfAuthor = 1;
          }
          _this._totalTime = (numberOfUpdates - (currentStoryOfAuthor - 1)) * timePerStory;
          return _this._startStoriesPlayback();
        } else {
          _this._startStoriesPlayback();
          return longPress = false;
        }
      };
    })(this));
    this._nextHit.onLongPress(function() {
      return longPress = true;
    });
    return this._backHit.onLongPress(function() {
      return longPress = true;
    });
  };

  StoryComponent.prototype._startStoriesPlayback = function() {
    this._progressBarHolderAnimation = this._progressBarHolder.animate({
      properties: {
        width: Screen.width
      },
      curve: Bezier.linear,
      time: this._totalTime
    });
    return this._progressBarHolderAnimation.on(Events.AnimationEnd, (function(_this) {
      return function(animation, layer) {
        return _this._endOfUpdatesEvent.x = 1;
      };
    })(this));
  };

  StoryComponent.prototype._stopStoriesPlayback = function() {
    return this._progressBarHolderAnimation.stop();
  };

  StoryComponent.prototype._resetStoriesPlayback = function() {
    this._progressBarHolderAnimation.finish();
    return this._progressBarHolderAnimation.reset();
  };

  return StoryComponent;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2NoYXJsaWVkZWV0cy9Ecm9wYm94IChQZXJzb25hbCkvRGVzaWduL0ZyYW1lci9TdG9yeUNvbXBvbmVudC9TdG9yeUNvbXBvbmVudC9leGFtcGxlcy9tdWx0aVNldEV4YW1wbGUuZnJhbWVyL21vZHVsZXMvU3RvcnlDb21wb25lbnQuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblx0IyBTdG9yeSBDb21wb25lbnRcblxuXHQjIEV4YW1wbGUgdXNhZ2Vcblx0e1N0b3J5Q29tcG9uZW50fSA9IHJlcXVpcmUgXCJTdG9yeUNvbXBvbmVudFwiXG5cdGV4YW1wbGVTZXQgPSBuZXcgU3RvcnlDb21wb25lbnRcblx0XHRwcm9ncmVzc0Jhckhvcml6b250YWxQYWRkaW5nOiAxMlxuXHRcdHByb2dyZXNzQmFyVmVydGljYWxQYWRkaW5nOiAxMlxuXHRcdHByb2dyZXNzQmFySGVpZ2h0OiA0XG5cdFx0cHJvZ3Jlc3NCYXJHcmFkaWVudDogdHJ1ZVxuXHRcdHRpbWVQZXJTdG9yeTogM1xuXHRcdHN0b3JpZXM6IFsgXCJpbWFnZXMvMS5wbmdcIiwgXCJpbWFnZXMvMi5wbmdcIiwgXCJpbWFnZXMvMy5wbmdcIiBdXG5cblx0IyBMaXN0ZW4gZm9yIHN0b3J5IGNvbXBsZXRpb24gZXZlbnRcblx0ZXhhbXBsZS5fZW5kT2ZVcGRhdGVzRXZlbnQub24gXCJjaGFuZ2U6eFwiLCAtPlxuXHRcdGlmIGV4YW1wbGUuX2VuZE9mVXBkYXRlc0V2ZW50LnggPT0gMVxuXG5cdCMgU3RhcnQgc3RvcnkgcGxheWJhY2tcblx0ZXhhbXBsZS5fc3RhcnRTdG9yaWVzUGxheWJhY2soKVxuXG5cdCMgU3RvcCBzdG9yeSBwbGF5YmFja1xuXHRleGFtcGxlLl9zdG9wU3Rvcmllc1BsYXliYWNrKClcblx0XG5cdCMgUmVzZXQgc3RvcnkgcGxheWJhY2tcblx0ZXhhbXBsZS5fcmVzZXRTdG9yaWVzUGxheWJhY2soKVxuXG4jIyNcblxuY2xhc3MgZXhwb3J0cy5TdG9yeUNvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cblx0XHRvcHRpb25zID0gXy5kZWZhdWx0cyBAb3B0aW9ucyxcblx0XHRcdHByb2dyZXNzQmFySG9yaXpvbnRhbFBhZGRpbmc6IDEyXG5cdFx0XHRwcm9ncmVzc0JhclZlcnRpY2FsUGFkZGluZzogMTJcblx0XHRcdHByb2dyZXNzQmFySGVpZ2h0OiA0XG5cdFx0XHRwcm9ncmVzc0JhckdyYWRpZW50OiB0cnVlXG5cdFx0XHR0aW1lUGVyU3Rvcnk6IDNcblx0XHRcdHN0b3JpZXM6IFtcIlwiXVxuXG5cdFx0c3VwZXIgQG9wdGlvbnNcblxuXHRcdEBfbnVtYmVyT2ZVcGRhdGVzID0gQG9wdGlvbnMuc3Rvcmllcy5sZW5ndGhcblx0XHRAX3RvdGFsVGltZSA9ICggQF9udW1iZXJPZlVwZGF0ZXMgKiBAb3B0aW9ucy50aW1lUGVyU3RvcnkgKVxuXG5cdFx0QF9zZXR1cExheW91dCgpXG5cblx0X3NldHVwTGF5b3V0OiA9PlxuXG5cdFx0bG9uZ1ByZXNzID0gZmFsc2Vcblx0XHRjdXJyZW50U3RvcnlPZkF1dGhvciA9IDFcblx0XHR0aW1lUGVyU3RvcnkgPSBAb3B0aW9ucy50aW1lUGVyU3Rvcnlcblx0XHRudW1iZXJPZlVwZGF0ZXMgPSBAb3B0aW9ucy5zdG9yaWVzLmxlbmd0aFxuXG5cdFx0IyBMYXlvdXQgY29uc3RydWN0aW9uXG5cblx0XHRAX3N0b3JpZXNDb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjkyOTI5XCJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdFx0bmFtZTogXCJTdG9yaWVzIENvbnRhaW5lclwiXG5cdFx0XHRwYXJlbnQ6IHRoaXNcblx0XHRcdGNsaXA6IHRydWVcblxuXHRcdCMgSGl0IGFyZWFzIGNvbnN0cnVjdGlvblxuXG5cdFx0QF9uZXh0SGl0ID0gbmV3IExheWVyXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoIC8gMS41XG5cdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdHg6IEFsaWduLnJpZ2h0XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgwLDAsMCwwKVwiXG5cdFx0XHRuYW1lOiBcIk5leHQgaGl0XCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHRAX2JhY2tIaXQgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGggLyAzXG5cdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdHg6IEFsaWduLmxlZnRcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJyZ2JhKDAsMCwwLDApXCJcblx0XHRcdG5hbWU6IFwiQmFjayBoaXRcIlxuXHRcdFx0cGFyZW50OiBAX3N0b3JpZXNDb250YWluZXJcblxuXHRcdEBfZW5kT2ZVcGRhdGVzRXZlbnQgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiAxXG5cdFx0XHRoZWlnaHQ6IDFcblx0XHRcdHg6IDBcblx0XHRcdHk6IDBcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJyZ2JhKDAsMCwwLDApXCJcblx0XHRcdG5hbWU6IFwiVmFyaWFibGUgSG9sZGVyXCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cblx0XHQjIFdpZHRocyB2YWx1ZXMgZm9yIHByb2dyZXNzXG5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoID0gKCBTY3JlZW4ud2lkdGggKSAtICggQG9wdGlvbnMucHJvZ3Jlc3NCYXJIb3Jpem9udGFsUGFkZGluZyAqIDIgKVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsU2VjdGlvbldpZHRoID0gKCBAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoIC8gQF9udW1iZXJPZlVwZGF0ZXMgKVxuXG5cdFx0IyBQcm9ncmVzcyBiYXIgY29uc3RydWN0aW9uXG5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyID0gbmV3IExheWVyXG5cdFx0XHRoZWlnaHQ6IEBvcHRpb25zLnByb2dyZXNzQmFySGVpZ2h0XG5cdFx0XHR3aWR0aDogQF9wcm9ncmVzc0JhckhvbGRlckluaXRpYWxXaWR0aFxuXHRcdFx0eDogQWxpZ24uY2VudGVyXG5cdFx0XHR5OiBAb3B0aW9ucy5wcm9ncmVzc0JhclZlcnRpY2FsUGFkZGluZ1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiMwMGZmZmZmZlwiXG5cdFx0XHRuYW1lOiBcIlByb2dyZXNzIEJhciBIb2xkZXJcIlxuXHRcdFx0cGFyZW50OiBAX3N0b3JpZXNDb250YWluZXJcblxuXHRcdCMgU2luZ2xlIGF1dGhvcidzIHN0b3JpZXMgaG9sZGVyIGNvbnN0cnVjdGlvbnNcblxuXHRcdEBfYXV0aG9yU3RvcnlIb2xkZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGggKiBAX251bWJlck9mVXBkYXRlc1xuXHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0XHRuYW1lOiBcIkF1dGhlcidzIFN0b3JpZXMgSG9sZGVyXCJcblx0XHRcdHBhcmVudDogQF9zdG9yaWVzQ29udGFpbmVyXG5cdFx0QF9hdXRob3JTdG9yeUhvbGRlci5wbGFjZUJlaGluZChAX3Byb2dyZXNzQmFySG9sZGVyKVxuXHRcdGF1dGhvclN0b3J5SG9sZGVyID0gQF9hdXRob3JTdG9yeUhvbGRlclxuXG5cdFx0cHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsV2lkdGggPSBAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFdpZHRoXG5cdFx0cHJvZ3Jlc3NCYXJIb2xkZXJGb3JMb29wID0gQF9wcm9ncmVzc0JhckhvbGRlclxuXHRcdHByb2dyZXNzQmFySG9sZGVySW5pdGlhbFNlY3Rpb25XaWR0aEZvckxvb3AgPSBAX3Byb2dyZXNzQmFySG9sZGVySW5pdGlhbFNlY3Rpb25XaWR0aFxuXG5cdFx0IyBHZW5lcmF0ZSBwcm9ncmVzcyBhbmQgZGV0ZXJtaW5lIGN1cnJlbnQgc3RvcnkgcG9zaXRpb24gZm9yIGF1dGhvclxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXIub25DaGFuZ2UgXCJ3aWR0aFwiLCAtPlxuXHRcdFx0YXV0aG9yUHJvZ3Jlc3MgPSBVdGlscy5tb2R1bGF0ZSh0aGlzLndpZHRoLCBbMCwgcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsV2lkdGhdLCBbMCwgMV0pXG5cdFx0XHRmb3IgbnVtYmVyIGluIFswLi4ubnVtYmVyT2ZVcGRhdGVzXVxuXHRcdFx0XHRpZiAoICggcHJvZ3Jlc3NCYXJIb2xkZXJGb3JMb29wLndpZHRoIDwgKCBwcm9ncmVzc0JhckhvbGRlckluaXRpYWxXaWR0aCAqICggbnVtYmVyICsgMSApICkgKSAmJiAoIHByb2dyZXNzQmFySG9sZGVyRm9yTG9vcC53aWR0aCA+ICggcHJvZ3Jlc3NCYXJIb2xkZXJJbml0aWFsU2VjdGlvbldpZHRoRm9yTG9vcCAqICggbnVtYmVyICkgKSApIClcblx0XHRcdFx0XHRjdXJyZW50U3RvcnlPZkF1dGhvciA9IG51bWJlciArIDFcblx0XHRcdFx0XHRhdXRob3JTdG9yeUhvbGRlci54ID0gKCAtIFNjcmVlbi53aWR0aCAqIG51bWJlciApXG5cblx0XHQjIEdlbmVyYXRlIHN0b3JpZXMgYW5kIHByb2dyZXNzIGJhciBzZWN0aW9uc1xuXG5cdFx0aWYgKCBAX251bWJlck9mVXBkYXRlcyA+IDEgKVxuXHRcdFx0IyBGb3IgbW9yZSB0aGFuIG9uZSB1cGRhdGUgY3JlYXRlIHNlZ21lbnRzIGFuZCBzcGFjZSBldmVubHlcblx0XHRcdG51bWJlck9mVXBkYXRlcyA9IEBfbnVtYmVyT2ZVcGRhdGVzXG5cdFx0XHRmb3IgbnVtYmVyIGluIFswLi4ubnVtYmVyT2ZVcGRhdGVzXVxuXHRcdFx0XHRAX3N0b3J5ID0gbmV3IExheWVyXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBVdGlscy5yYW5kb21Db2xvcigpXG5cdFx0XHRcdFx0aW1hZ2U6IEBvcHRpb25zLnN0b3JpZXNbbnVtYmVyXVxuXHRcdFx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRcdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdFx0XHR4OiBTY3JlZW4ud2lkdGggKiBudW1iZXJcblx0XHRcdFx0XHRwYXJlbnQ6IEBfYXV0aG9yU3RvcnlIb2xkZXJcblx0XHRcdFx0QF9zdG9yeS5uYW1lID0gXCJTdG9yeSBcIiArICggbnVtYmVyICsgMSApXG5cdFx0XHRcdEBfcHJvZ3Jlc3NCYXJTZWN0aW9uID0gbmV3IExheWVyXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZmZmZcIlxuXHRcdFx0XHRcdGhlaWdodDogQG9wdGlvbnMucHJvZ3Jlc3NCYXJIZWlnaHRcblx0XHRcdFx0XHR3aWR0aDogKEBfcHJvZ3Jlc3NCYXJIb2xkZXIud2lkdGgtQG9wdGlvbnMucHJvZ3Jlc3NCYXJIb3Jpem9udGFsUGFkZGluZykgLyAoIEBfbnVtYmVyT2ZVcGRhdGVzIClcblx0XHRcdFx0XHR4OiBudW1iZXIgKiAoICggQF9wcm9ncmVzc0JhckhvbGRlci53aWR0aCAvIEBfbnVtYmVyT2ZVcGRhdGVzICkgKyAoICggQG9wdGlvbnMucHJvZ3Jlc3NCYXJIb3Jpem9udGFsUGFkZGluZyAvIDIgKSAvIEBfbnVtYmVyT2ZVcGRhdGVzICkgKVxuXHRcdFx0XHRcdGJvcmRlclJhZGl1czogQG9wdGlvbnMucHJvZ3Jlc3NCYXJIZWlnaHRcblx0XHRcdFx0XHRwYXJlbnQ6IEBfcHJvZ3Jlc3NCYXJIb2xkZXJcblx0XHRcdFx0QF9wcm9ncmVzc0JhclNlY3Rpb24ubmFtZSA9IFwiUHJvZ3Jlc3MgQmFyIFNlY3Rpb24gXCIgKyBudW1iZXJcblx0XHRlbHNlXG5cdFx0XHQjIEZvciBvbmUgdXBkYXRlIGNyZWF0ZSBmdWxsIHdpZHRoIHNlZ21lbnRcblx0XHRcdEBfc3RvcnkxID0gbmV3IExheWVyXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogVXRpbHMucmFuZG9tQ29sb3IoKVxuXHRcdFx0XHRpbWFnZTogQG9wdGlvbnMuc3Rvcmllc1swXVxuXHRcdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHBhcmVudDogQF9hdXRob3JTdG9yeUhvbGRlclxuXHRcdFx0XHRuYW1lOiBcIlN0b3J5XCJcblx0XHRcdEBfcHJvZ3Jlc3NCYXJTZWN0aW9uMSA9IG5ldyBMYXllclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZmZmZlwiXG5cdFx0XHRcdGhlaWdodDogQG9wdGlvbnMucHJvZ3Jlc3NCYXJIZWlnaHRcblx0XHRcdFx0d2lkdGg6IEBfcHJvZ3Jlc3NCYXJIb2xkZXIud2lkdGhcblx0XHRcdFx0eDogQWxpZ24ubGVmdFxuXHRcdFx0XHRib3JkZXJSYWRpdXM6IEBvcHRpb25zLnByb2dyZXNzQmFySGVpZ2h0XG5cdFx0XHRcdHBhcmVudDogQF9wcm9ncmVzc0JhckhvbGRlclxuXG5cdFx0IyBDcmVhdGUgZHVwbGljYXRlIHByb2dyZXNzIGJhciBhbmQgb3B0aW9uYWwgZ3JhZGllbnQgZm9yIGJhY2tncm91bmRcblxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJCRyA9IEBfcHJvZ3Jlc3NCYXJIb2xkZXIuY29weSgpXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckJHLm5hbWUgPSBcIlByb2dyZXNzIEJhciBIb2xkZXIgQmFja2dyb3VuZFwiXG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckJHLm9wYWNpdHkgPSAwLjI1XG5cdFx0QF9wcm9ncmVzc0JhckhvbGRlckJHLnBhcmVudCA9IEBfc3Rvcmllc0NvbnRhaW5lclxuXG5cdFx0aWYgKCBAb3B0aW9ucy5wcm9ncmVzc0JhckdyYWRpZW50ID09IHRydWUgKVxuXHRcdFx0QF9wcm9ncmVzc0JhckJhY2tncm91bmRHcmFkaWVudCA9IG5ldyBMYXllclxuXHRcdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHRcdGhlaWdodDogKCBAb3B0aW9ucy5wcm9ncmVzc0JhclZlcnRpY2FsUGFkZGluZyAqIDIgKSArICggQG9wdGlvbnMucHJvZ3Jlc3NCYXJIZWlnaHQgKyA0IClcblx0XHRcdFx0Z3JhZGllbnQ6XG5cdFx0XHRcdFx0c3RhcnQ6IFwicmdiYSgwLDAsMCwwKVwiXG5cdFx0XHRcdFx0ZW5kOiBcInJnYmEoMCwwLDAsMC4zKVwiXG5cdFx0XHRcdG5hbWU6IFwiUHJvZ3Jlc3MgQmFyIEdyYWRpZW50XCJcblx0XHRcdFx0cGFyZW50OiBAX3N0b3JpZXNDb250YWluZXJcblxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJCRy5icmluZ1RvRnJvbnQoKVxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXIuYnJpbmdUb0Zyb250KClcblxuXHRcdCMgUHJvZ3Jlc3MgYmFyIGNsaXBwaW5nIGZvciBhbmltYXRpb25cblxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXIuY2xpcCA9IHRydWVcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyLndpZHRoID0gMFxuXG5cdFx0IyBUb3VjaCBhY3Rpb25zXG5cblx0XHRAX25leHRIaXQub25Ub3VjaFN0YXJ0ID0+XG5cdFx0XHRAX3N0b3BTdG9yaWVzUGxheWJhY2soKVxuXG5cdFx0QF9iYWNrSGl0Lm9uVG91Y2hTdGFydCA9PlxuXHRcdFx0QF9zdG9wU3Rvcmllc1BsYXliYWNrKClcblxuXHRcdEBfbmV4dEhpdC5wcm9ncmVzc0JhckhvbGRlciA9IEBfcHJvZ3Jlc3NCYXJIb2xkZXJcblx0XHRAX25leHRIaXQucHJvZ3Jlc3NCYXJIb2xkZXJCRyA9IEBfcHJvZ3Jlc3NCYXJIb2xkZXJCR1xuXHRcdEBfbmV4dEhpdC5udW1iZXJPZlVwZGF0ZXMgPSBAX251bWJlck9mVXBkYXRlc1xuXG5cdFx0QF9iYWNrSGl0LnByb2dyZXNzQmFySG9sZGVyID0gQF9wcm9ncmVzc0JhckhvbGRlclxuXHRcdEBfYmFja0hpdC5wcm9ncmVzc0JhckhvbGRlckJHID0gQF9wcm9ncmVzc0JhckhvbGRlckJHXG5cdFx0QF9iYWNrSGl0Lm51bWJlck9mVXBkYXRlcyA9IEBfbnVtYmVyT2ZVcGRhdGVzXG5cblx0XHRAX25leHRIaXQub25Ub3VjaEVuZCA9PlxuXHRcdFx0aWYgbG9uZ1ByZXNzID09IGZhbHNlXG5cdFx0XHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXIud2lkdGggPSAoIEBfcHJvZ3Jlc3NCYXJIb2xkZXJCRy53aWR0aCAvIG51bWJlck9mVXBkYXRlcyApICogKCBjdXJyZW50U3RvcnlPZkF1dGhvciApXG5cdFx0XHRcdGN1cnJlbnRTdG9yeU9mQXV0aG9yKytcblx0XHRcdFx0aWYgY3VycmVudFN0b3J5T2ZBdXRob3IgPj0gbnVtYmVyT2ZVcGRhdGVzXG5cdFx0XHRcdFx0Y3VycmVudFN0b3J5T2ZBdXRob3IgPSBjdXJyZW50U3RvcnlPZkF1dGhvclxuXHRcdFx0XHRAX3RvdGFsVGltZSA9ICggKCBudW1iZXJPZlVwZGF0ZXMgLSAoIGN1cnJlbnRTdG9yeU9mQXV0aG9yIC0gMSApICkgKiB0aW1lUGVyU3RvcnkgKVxuXHRcdFx0XHRAX3N0YXJ0U3Rvcmllc1BsYXliYWNrKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0QF9zdGFydFN0b3JpZXNQbGF5YmFjaygpXG5cdFx0XHRcdGxvbmdQcmVzcyA9IGZhbHNlXG5cblx0XHRAX2JhY2tIaXQub25Ub3VjaEVuZCA9PlxuXHRcdFx0aWYgbG9uZ1ByZXNzID09IGZhbHNlXG5cdFx0XHRcdGlmIGN1cnJlbnRTdG9yeU9mQXV0aG9yID4gMVxuXHRcdFx0XHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXIud2lkdGggPSAoIEBfcHJvZ3Jlc3NCYXJIb2xkZXJCRy53aWR0aCAvIG51bWJlck9mVXBkYXRlcyApICogKCBjdXJyZW50U3RvcnlPZkF1dGhvciAtIDIgKVxuXHRcdFx0XHRjdXJyZW50U3RvcnlPZkF1dGhvci0tXG5cdFx0XHRcdGlmIGN1cnJlbnRTdG9yeU9mQXV0aG9yIDwgMVxuXHRcdFx0XHRcdGN1cnJlbnRTdG9yeU9mQXV0aG9yID0gMVxuXHRcdFx0XHRAX3RvdGFsVGltZSA9ICggKCBudW1iZXJPZlVwZGF0ZXMgLSAoIGN1cnJlbnRTdG9yeU9mQXV0aG9yIC0gMSApICkgKiB0aW1lUGVyU3RvcnkgKVxuXHRcdFx0XHRAX3N0YXJ0U3Rvcmllc1BsYXliYWNrKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0QF9zdGFydFN0b3JpZXNQbGF5YmFjaygpXG5cdFx0XHRcdGxvbmdQcmVzcyA9IGZhbHNlXG5cblx0XHRAX25leHRIaXQub25Mb25nUHJlc3MgLT5cblx0XHRcdGxvbmdQcmVzcyA9IHRydWVcblxuXHRcdEBfYmFja0hpdC5vbkxvbmdQcmVzcyAtPlxuXHRcdFx0bG9uZ1ByZXNzID0gdHJ1ZVxuXG5cdF9zdGFydFN0b3JpZXNQbGF5YmFjazogLT5cblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQW5pbWF0aW9uID0gQF9wcm9ncmVzc0JhckhvbGRlci5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHRjdXJ2ZTogQmV6aWVyLmxpbmVhclxuXHRcdFx0dGltZTogQF90b3RhbFRpbWVcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQW5pbWF0aW9uLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsIChhbmltYXRpb24sIGxheWVyKSA9PlxuXHRcdFx0QF9lbmRPZlVwZGF0ZXNFdmVudC54ID0gMVxuXG5cdF9zdG9wU3Rvcmllc1BsYXliYWNrOiAtPlxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJBbmltYXRpb24uc3RvcCgpXG5cblx0X3Jlc2V0U3Rvcmllc1BsYXliYWNrOiAtPlxuXHRcdEBfcHJvZ3Jlc3NCYXJIb2xkZXJBbmltYXRpb24uZmluaXNoKClcblx0XHRAX3Byb2dyZXNzQmFySG9sZGVyQW5pbWF0aW9uLnJlc2V0KCkiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUNBQTs7QURBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBOzs7O0FBNEJNLE9BQU8sQ0FBQzs7O0VBQ0Esd0JBQUMsUUFBRDtBQUVaLFFBQUE7SUFGYSxJQUFDLENBQUEsNkJBQUQsV0FBUzs7SUFFdEIsT0FBQSxHQUFVLENBQUMsQ0FBQyxRQUFGLENBQVcsSUFBQyxDQUFBLE9BQVosRUFDVDtNQUFBLDRCQUFBLEVBQThCLEVBQTlCO01BQ0EsMEJBQUEsRUFBNEIsRUFENUI7TUFFQSxpQkFBQSxFQUFtQixDQUZuQjtNQUdBLG1CQUFBLEVBQXFCLElBSHJCO01BSUEsWUFBQSxFQUFjLENBSmQ7TUFLQSxPQUFBLEVBQVMsQ0FBQyxFQUFELENBTFQ7S0FEUztJQVFWLGdEQUFNLElBQUMsQ0FBQSxPQUFQO0lBRUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQ3JDLElBQUMsQ0FBQSxVQUFELEdBQWdCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsT0FBTyxDQUFDO0lBRTdDLElBQUMsQ0FBQSxZQUFELENBQUE7RUFmWTs7MkJBaUJiLFlB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
