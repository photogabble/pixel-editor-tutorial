// Image is a reserved word in JavaScript so I use Pixels instead
var Pixels = {
    width: 16,
    height: 16,
    pixels: [],

    // Initialisation of the ImageLayer
    setUp: function(width, height)
    {
        this.width  = (width !== undefined) ? width : 16;
        this.height = (height !== undefined) ? height : 16;
    },

    // Reset Everything
    reset: function()
    {

    },

    setPixel: function( row, col, value )
    {
        this.pixels[ this.width * row + col ] = value;
    },

    getPixel: function( row, col )
    {
        return this.pixels[ this.width * row + col ];
    },

    getPixels: function()
    {
        return this.pixels;
    },

    load: function(){

    },

    save: function(){

    }
};

var Mouse = {
    x: 0,
    y: 0,
    events: {
        mouseover: false,
        mouseout: false,
        mousedown: false,
        mousemove: false,
        mouseButton: 0
    },
    previousEvents: {
        mouseover: false,
        mouseout: false,
        mousedown: false,
        mousemove: false,
        mouseButton: 0
    }
};

$('#paintMe').on('mouseover', function(e){
    Mouse.events.mouseover   = true;
    Mouse.x                  = Math.floor(e.clientX - $(this).offset().left);
    Mouse.y                  = Math.floor(e.clientY - $(this).offset().top);
});

$('#paintMe').on('mouseout', function(e)
{
    Mouse.events.mousemove   = false;
    Mouse.events.mouseover   = false;
    Mouse.events.mouseout    = true;
    Mouse.events.mouseButton = 0;

    Mouse.x                  = 0;
    Mouse.y                  = 0;
});

$('#paintMe').on('mousemove', function(e)
{
    Mouse.events.mousemove   = true;
    Mouse.x                  = Math.floor(e.clientX - $(this).offset().left);
    Mouse.y                  = Math.floor(e.clientY - $(this).offset().top);
    return false;
});

$('#paintMe').on('mousedown', function(e)
{
    Mouse.events.mousedown   = true;
    Mouse.events.mouseup     = false;
    Mouse.events.mouseButton = e.which;
    return false;
});

$('#paintMe').on('mouseup', function(e)
{
    Mouse.events.mousedown   = false;
    Mouse.events.mouseup     = true;
    Mouse.events.mouseButton = 0;
    return false;
});

// This returns false to disable the operating systems context menu on right click
$('#paintMe').contextmenu(function() {
    return false;
});


var App = {
    timestamp: function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    },

    run: function(options)
    {
        var now,
        dt       = 0,
        last     = App.timestamp(),
        slow     = options.slow || 1, // slow motion scaling factor
        step     = 1/options.fps,
        slowStep = slow * step,
        update   = options.update,
        render   = options.render,
        canvas   = options.canvas,
        context  = options.canvas.get(0).getContext("2d");

        function frame() {
            now = App.timestamp();
            dt = dt + Math.min(1, (now - last) / 1000);
            while(dt > slowStep) {
                dt = dt - slowStep;
                update(step, canvas, context);
            }
            render(dt/slow, canvas, context);
            last = now;
            requestAnimationFrame(frame, canvas);
        }
        requestAnimationFrame(frame);
    }
};

App.run({
    canvas: $('#paintMe'),
    fps: 60,
    update: function(step, canvas, context){

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Mouse Events
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        // Has the mouse event changed since it was last logged?
        if ( Mouse.previousEvents.mouseover !== Mouse.events.mouseover )
        {
            Mouse.previousEvents.mouseover = Mouse.events.mouseover;
            console.log('Mouse Over Event Changed');
        }

        if ( Mouse.previousEvents.mousemove !== Mouse.events.mousemove )
        {
            Mouse.previousEvents.mousemove = Mouse.events.mousemove;
            console.log('Mouse Move Event Changed');
        }

        if ( Mouse.previousEvents.mouseup !== Mouse.events.mouseup )
        {
            Mouse.previousEvents.mouseup = Mouse.events.mouseup;
            console.log('Mouse Up Event Changed');
        }

        if ( Mouse.previousEvents.mousedown !== Mouse.events.mousedown )
        {
            Mouse.previousEvents.mousedown = Mouse.events.mousedown;
            console.log('Mouse Down Event Changed');
        }

        if ( Mouse.previousEvents.mouseButton !== Mouse.events.mouseButton )
        {
            Mouse.previousEvents.mouseButton = Mouse.events.mouseButton;
            console.log('Mouse Button Event Changed');
        }


    },
    render: function(step, canvas, context){



    }
});
