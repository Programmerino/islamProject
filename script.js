var audio = document.getElementById("leaveSound");
audio.volume = 0.2;

$(".reader").each(function (index, obj) {
    $(obj).readmore({
        speed: 75,
        lessLink: `
            <a href="#" class="mdl-button">Read less</a>
      `,
        moreLink: `
            <a href="#" class="mdl-button">Read more</a>
      `,
    });
});


function loop() {
    var audio = document.getElementById("leaveSound");
    if ($('#mIll').visible()) {
        audio.muted = false
    } else {
        audio.muted = true
    }
    var audio = document.getElementById("heartbeat");
    if ($('#pulm').visible()) {
        audio.muted = false
    } else {
        audio.muted = true
    }
    var audio = document.getElementById("blink");
    if ($('#eye').visible()) {
        audio.muted = false
    } else {
        audio.muted = true
    }
    var audio = document.getElementById("coffeeSound");
    if ($('#coffee').visible()) {
        audio.muted = false
    } else {
        audio.muted = true
    }
};

var interval = setInterval(loop, 1000); // 1000 ms = 1 second

function play() {
    $("#heartbeat")[0].play();
    $("#heartbeat")[0].volume = 0.2;
}
var interval = setInterval(play, 500); // 1000 ms = 1 second

function blink() {
    // Usage!
    sleep(Math.floor(Math.random() * 3000)).then(() => {
        $("#blink")[0].play();
        $("#blink")[0].volume = 0.2;
        blink()
    });
}

blink()

$(document).ready(function () {
    play();
});

// sleep time expects milliseconds
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

var Eye = /** @class */ (function () {
    // Ticker
    //private _ticker = TweenMax.ticker.addEventListener('tick', this.tick.bind(this));
    function Eye() {
        this._element = document.querySelector('.eye');
        // Circles
        this._circleOrange = this._element.querySelector('.circle-orange');
        this._circleBlue = this._element.querySelector('.circle-blue');
        this._circleWhite = this._element.querySelector('.circle-white');
        this._circleWhiteSmall = this._element.querySelector('.circle-white-small');
        this._circleBlack = this._element.querySelector('.circle-black');
        // Morph elements
        this._eyeOpen = this._element.querySelector('.eye-open');
        this._eyeClosed = this._element.querySelector('.eye-closed');
        // Groups
        this._eye = this._element.querySelector('.group-eye');
        this._pupil = this._element.querySelector('.pupil');
        // Timeline
        this._timeline = new TimelineMax({
            repeat: -1,
            repeatDelay: 2
        });
        this.createTimeline();
        //this.addEventListeners();
    }
    Eye.prototype.addEventListeners = function () {
        1
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    };
    Eye.prototype.tick = function () {
        //console.log('tick');
    };
    Eye.prototype.handleMouseMove = function (event) {};
    Eye.prototype.createTimeline = function () {
        this.bounce();
        this.lookAround();
        this.blink();
    };
    Eye.prototype.lookAround = function () {
        // Look right
        this._timeline.to(this._pupil, 0.2, {
            x: "+=50",
            y: "+=50"
        });
        this._timeline.to(this._circleBlack, 0.2, {
            x: "+=50",
            y: "+=50"
        }, '-=0.2');
        // Look left
        this._timeline.to(this._pupil, 0.2, {
            x: "-=100"
        }, '+=0.5');
        this._timeline.to(this._circleBlack, 0.2, {
            x: "-=100"
        }, '-=0.2');
        // Look middle
        this._timeline.to(this._pupil, 0.2, {
            x: "+=50",
            y: "-=50"
        }, '+=1.0');
        this._timeline.to(this._circleBlack, 0.2, {
            x: "+=50",
            y: "-=50"
        }, '-=0.2');
    };
    Eye.prototype.blink = function () {
        // Smallen orange
        this._timeline.to(this._circleOrange, 0.2, {
            scaleY: 1,
            transformOrigin: 'center center',
            repeat: 1,
            yoyo: true,
        });
    };
    Eye.prototype.bounce = function () {
        this._timeline.to(this._element, .10, {
            scaleY: 0.75,
            transformOrigin: "50% 100%",
            repeat: 1,
            yoyo: true
        });
        this._timeline.to(this._element, .5, {
            y: -200,
            repeat: 1,
            yoyo: true,
            ease: Circ.easeOut
        });
    };
    return Eye;
}());
var eye = new Eye();