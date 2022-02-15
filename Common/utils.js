// utils

function error(msg) {
    var topWindow = window.top;
    if (topWindow.console) {
        if (topWindow.console.error) {
            topWindow.console.error(msg);
        } else if (topWindow.console.log) {
            topWindow.console.log(msg);
        }
    }
}

function loadVertexShader(gl, opt_errorCallback) {
    let shaderSource = '';
    const shaderScript = document.getElementById("vertex-shader-3d");
    if (!shaderScript) {
        throw ('*** Error: unknown vertex shader');
    }
    shaderSource = shaderScript.text;
    const errFn = opt_errorCallback || error;
    
    const shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        const lastError = gl.getShaderInfoLog(shader);
        errFn('*** Error compiling shader \'' + shader + '\':' + lastError + `\n` + shaderSource.split('\n').map((l,i) => `${i + 1}: ${l}`).join('\n'));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function loadFragmentShader(gl, opt_errorCallback) {
    let shaderSource = '';
    const shaderScript = document.getElementById("fragment-shader-3d");
    if (!shaderScript) {
        throw ('*** Error: unknown fragment shader');
    }
    shaderSource = shaderScript.text;
    const errFn = opt_errorCallback || error;
    
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        const lastError = gl.getShaderInfoLog(shader);
        errFn('*** Error compiling shader \'' + shader + '\':' + lastError + `\n` + shaderSource.split('\n').map((l,i) => `${i + 1}: ${l}`).join('\n'));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgramFromScripts(gl, opt_errorCallback) {
    const vertexShader = loadVertexShader(gl, opt_errorCallback);
    const fragmentShader = loadFragmentShader(gl, opt_errorCallback);
    const shaders = [vertexShader, fragmentShader];
    return createProgram(gl, shaders, opt_errorCallback);
}

function createProgram(gl, shaders, opt_errorCallback) {
    const errFn = opt_errorCallback || error;
    const program = gl.createProgram();
    shaders.forEach(function(shader) {
        gl.attachShader(program, shader);
    });
    gl.linkProgram(program);

    //if not linked
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        const lastError = gl.getProgramInfoLog(program);
        errFn('Error in program linking:' + lastError);

        gl.deleteProgram(program);
        return null;
    }
    return program;
}

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            window.setTimeout(callback, 1000/60);
        };
})();

function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width = canvas.clientWidth * multiplier | 0;
    const height = canvas.clientWidth * multiplier | 0;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}