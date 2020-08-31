export class HandleScroll {
    // This code is taken and edited from https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
    
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    static keys() {
        return {32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1};
    }

    static preventDefault(e : any) {
        e.preventDefault();
    }

    static preventDefaultForScrollKeys(e : any) {
        if (HandleScroll.keys()[e.keyCode]) {
            HandleScroll.preventDefault(e);
            return false;
        }
    }

    // Modern Chrome requires { passive: false } when adding event
    static supportsPassive() : boolean {
        let res = false;
        try {
            window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
                get: () => { res = true } 
            }));
        } catch(e) { }
        return res;
    }

    static wheelOpt() : any {
        return HandleScroll.supportsPassive() ? { passive: false } : false;
    }
    static wheelEvent() : any {
        return 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    }

    // Call this to disable
    static disableScroll() {
        window.addEventListener('DOMMouseScroll', HandleScroll.preventDefault, false); // older FF
        window.addEventListener(HandleScroll.wheelEvent(), HandleScroll.preventDefault, HandleScroll.wheelOpt()); // modern desktop
        window.addEventListener('touchmove', HandleScroll.preventDefault, HandleScroll.wheelOpt()); // mobile
        window.addEventListener('keydown', HandleScroll.preventDefaultForScrollKeys, false);
    }

    // Call this to enable
    static enableScroll() {
        window.removeEventListener('DOMMouseScroll', HandleScroll.preventDefault, false);
        window.removeEventListener(HandleScroll.wheelEvent(), HandleScroll.preventDefault, HandleScroll.wheelOpt()); 
        window.removeEventListener('touchmove', HandleScroll.preventDefault, HandleScroll.wheelOpt());
        window.removeEventListener('keydown', HandleScroll.preventDefaultForScrollKeys, false);
    }
}