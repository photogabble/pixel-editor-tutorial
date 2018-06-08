let Mouse = {
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

const MouseEvents = (mainCanvas) => {
    mainCanvas.addEventListener('mouseover', function (e) {
        Mouse.events.mouseover = true;
        Mouse.x = Math.floor(e.clientX - $(this).offset().left);
        Mouse.y = Math.floor(e.clientY - $(this).offset().top);
    });

    mainCanvas.addEventListener('mouseout', function (e) {
        Mouse.events.mousemove = false;
        Mouse.events.mouseover = false;
        Mouse.events.mousedown = false;
        Mouse.events.mouseout = true;
        Mouse.events.mouseButton = 0;

        Mouse.x = 0;
        Mouse.y = 0;
    });

    mainCanvas.addEventListener('mousemove', function (e) {
        Mouse.events.mousemove = true;
        Mouse.x = Math.floor(e.clientX - $(this).offset().left);
        Mouse.y = Math.floor(e.clientY - $(this).offset().top);
        return false;
    });

    mainCanvas.addEventListener('mousedown', function (e) {
        Mouse.events.mousedown = true;
        Mouse.events.mouseup = false;
        Mouse.events.mouseButton = e.which;
        return false;
    });

    mainCanvas.addEventListener('mouseup', function (e) {
        Mouse.events.mousedown = false;
        Mouse.events.mouseup = true;
        Mouse.events.mouseButton = 0;
        return false;
    });

    // This returns false to disable the operating systems context menu on right click
    // mainCanvas.onContextMenu(function() {
    //     return false;
    // });
};

export {Mouse, MouseEvents};