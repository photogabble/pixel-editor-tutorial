import {MouseEvents} from "./mouse";
export default class {
    constructor (options)
    {
        MouseEvents(options.canvas);

        let now,
            dt       = 0,
            last     = timestamp(),
            slow     = options.slow || 1, // slow motion scaling factor
            step     = 1/options.fps,
            slowStep = slow * step,
            update   = options.update,
            render   = options.render,
            canvas   = options.canvas,
            context  = options.canvas.getContext("2d");

        function timestamp () {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        }

        function frame() {
            now = timestamp();
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
}