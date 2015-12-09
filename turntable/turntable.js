function Turntable(container, spriteUrl, numSprites, spriteWitdh, spriteHeight) {
	var loader = $("<div class='turntableLoader'/>").css({
			position: "absolute",
			left: 0,
			top: 0
		}),
		hint = $("<div class='turntableHint'/>").css({
			position: "absolute",
			left: 0,
			top: 0
		}),
		img = $("<img/>").css({
			position: "absolute",
			left: 0,
			top: 0
		}),
		error = $("<span class='turntableError'/>").css({
			position: "absolute"
		}),
		// heading before mousedown or after mouseup
		heading = 0,
		headingStep = 360/numSprites,
		// heading during mousemove
		_heading,
		spriteIndex = 0,
		mouseDownX,
		url
	;

	img.load(function() {
		loader.remove();
		heading = 0;
		spriteIndex = 0;
		container.on("mousedown.turntable", function(e) {
			e.preventDefault();
			mouseDownX = e.pageX;
			// start tracking mouse movements
			$("body").on({
				"mousemove.turntable": mousemove,
				"mouseup.turntable": stopBodyEvents,
				"mouseleave.turntable": stopBodyEvents
			});
		});
		if (hint) container.append(hint);
	});
	img.error(function(err){
		loader.remove();
		error.text("Unable to load " + url);
		container.append(error);
	});

	container
		.empty()
		.css({
			position: "relative",
			overflow: "hidden"
		})
		.append(img)
	;

	this.load = function(spriteUrl, numSprites, spriteWitdh, spriteHeight) {
		if (url == spriteUrl) return;
		container.off(".turntable");
		error.remove();
		if (hint) {
			hint.remove();
			hint.css({width: spriteWitdh+"px", height: spriteHeight+"px"});
		}
		loader.css({width: spriteWitdh+"px", height: spriteHeight+"px"});
		container
			.css({width: spriteWitdh+"px", height: spriteHeight+"px"})
			.append(loader)
		;
		img
			.css({width: numSprites*spriteWitdh+"px", height: spriteHeight+"px", left: 0})
			.attr("src", spriteUrl)
		;
		url = spriteUrl;
	}

	this.load(spriteUrl, numSprites, spriteWitdh, spriteHeight);

    function rotate(heading) {
        var _spriteIndex = Math.round(heading/headingStep);
		if (_spriteIndex==numSprites) _spriteIndex = 0;
		if (spriteIndex!=_spriteIndex) {
			spriteIndex = _spriteIndex;
			img.css("left",-spriteIndex*spriteWitdh);
		}
    }
	this.rotate = rotate;

	function mousemove(e) {
		// remove hint
		if (hint) {
			hint.remove();
			hint = null;
		}
		// converting displacement in pixels to degrees (width corresponds to 360 degrees)
        var displacement = -(e.pageX - mouseDownX)/spriteWitdh*360;
		_heading = heading + displacement;
		if (_heading<0) _heading = 360 + _heading % 360;
		else if (_heading>360) _heading = _heading % 360;
		rotate(_heading);
	}

	function stopBodyEvents() {
		// stop tracking mousemove, mouseup and mouseleave events
		$("body").off(".turntable");
		heading = _heading;
	}
};