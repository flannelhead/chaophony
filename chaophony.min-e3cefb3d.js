function createSynth(t,e,n,a,i){var o=Math.pow(2,1/12),r=t.createGain(),c=R.map(function(n){return createNote(e*Math.pow(o,n),R.prepend(1,a),t)},n);return R.forEach(function(t){t.connect(r)},c),{master:r,notes:c,envelope:i,ctx:t}}function createNote(t,e,n){var a=n.createGain();a.gain.value=0;var i=new Float32Array(e.length+1);R.forEach(function(t){i[t[1]]=t[0]},R.zip(e,R.range(1,e.length+1)));var o=n.createPeriodicWave(i,new Float32Array(e.length+1)),r=n.createOscillator();return r.setPeriodicWave(o),r.frequency.value=t,r.connect(a),r.start(),a}function hitNote(t,e){if(!(e>=t.notes.length)){var n=t.ctx.currentTime,a=t.notes[e].gain;a.cancelScheduledValues(n),a.setValueAtTime(0,n),a.linearRampToValueAtTime(1,n+t.envelope.attack),a.linearRampToValueAtTime(0,n+t.envelope.attack+t.envelope.release)}}function startNote(t,e){if(!(e>=t.notes.length)){var n=t.ctx.currentTime,a=t.notes[e].gain;a.cancelScheduledValues(n),a.setValueAtTime(0,n),a.linearRampToValueAtTime(1,n+t.envelope.attack)}}function killNote(t,e){if(!(e>=t.notes.length)){var n=t.ctx.currentTime,a=t.notes[e].gain;a.cancelScheduledValues(n),a.linearRampToValueAtTime(0,n+t.envelope.release)}}function killAllNotes(t){var e=t.ctx.currentTime;R.forEach(function(n){n.gain.cancelScheduledValues(e),n.gain.linearRampToValueAtTime(0,e+t.envelope.release)},t.notes)}function pendulumEoms(t){var e=Math.sin,n=Math.cos,a=t[0],i=t[1],o=t[2],r=t[3],c=t[4],l=t[5],s=r*r,u=c*c,d=l*l,h=i-a,m=o-i,f=o-a,p=1/(2*n(2*m)+4*n(2*h)-10);return[r,c,l,-(e(2*m+a)-e(2*m-a)-2*d*e(o-2*i+a)+2*d*e(f)+4*e(2*i-a)+4*s*e(2*h)+8*u*e(h)-10*e(a))*p,-(2*s*e(2*o-i-a)+e(2*f-i)+e(2*o-i)+2*u*e(2*m)-2*d*e(o+i-2*a)+6*d*e(m)-4*u*e(2*h)-14*s*e(h)-7*e(i-2*a)-7*e(i))*p,2*(d*e(2*m)+4*u*e(m)+e(o-2*i+2*a)+2*s*e(o-2*i+a)+e(o-2*i)+2*s*e(f)+e(o-2*a)+e(o))*p]}function totalEnergy(t){var e=-cos(t[0]),n=e-cos(t[1]),a=n-cos(t[2]),i=t[3]*cos(t[0]),o=i+t[4]*cos(t[1]),r=o+t[5]*cos(t[2]),c=t[3]*sin(t[0]),l=c+t[4]*sin(t[1]),s=l+t[5]*sin(t[2]);return(i*i+o*o+r*r+c*c+l*l+s*s)/2+e+n+a}function maximumVelocity(t){return Math.sqrt(2*totalEnergy(t)+12)}function jointCoordinates(t){var e=R.scanl(function(t,e){return[t[0]+Math.sin(e),t[1]-Math.cos(e)]},[0,0],R.take(3,t));return R.map(function(t){return{x:t[0],y:t[1]}},e)}function rk4Integrate(t,e,n){var a=R.multiply(e/2),i=R.multiply(e/3),o=R.multiply(e/6),r=t(n),c=t(vecAdd(n,r.map(a))),l=t(vecAdd(n,c.map(a))),s=t(vecAdd(n,l.map(R.multiply(e))));return R.reduce(vecAdd,n,[r.map(o),c.map(i),l.map(i),s.map(o)])}function toCanvasCoords(t,e,n){return{x:t+e*n.x,y:t-e*n.y}}function drawPendulum(t,e,n,a){var i=(Math.sin,Math.cos,.015*e),o=e/6-i,r=e/2,c=R.lPartial(toCanvasCoords,r,o);t.clearRect(0,0,e,e),t.lineWidth=1,t.globalAlpha=.6,t.strokeStyle="#268bd2",t.beginPath();var l=R.map(c,a);t.moveTo(l[0].x,l[0].y),R.forEach(function(e){t.lineTo(e.x,e.y)},R.tail(l)),t.stroke();var s=R.tail(R.map(c,jointCoordinates(n)));t.globalAlpha=1,t.lineWidth=.01*e,t.strokeStyle="black",t.beginPath(),t.moveTo(r,r),R.forEach(function(e){t.lineTo(e.x,e.y)},s),t.stroke(),R.zipWith(function(e,n){t.fillStyle=n,circle(t,e.x,e.y,i)},s,["#dc322f","#dc322f","#b58900"])}function circle(t,e,n,a){t.beginPath(),t.arc(e,n,a,0,2*Math.PI),t.fill()}function setupCanvas(t){var e=t.offsetWidth;t.width=e,t.height=e;var n=t.getContext("2d");return n.strokeStyle="black",n.lineJoin="round",{ctx:n,width:e}}function createPads(t,e,n,a,i){function o(t){return 100*t/6+"%"}var r=document.createElement("div");r.className="padContainer",r.style.width=o(e),r.style.height=o(n),r.style.left=o(a);var c=100/i,l=R.map(function(t){var e=document.createElement("div");return e.className="pad",e.style.width=c+"%",e.style.left=t*c+"%",r.appendChild(e),e},R.range(0,i));return t.appendChild(r),l}function simulate(t,e,n,a,i){var o=e-t+n,r=0;if(o<i.lockupLimit){var c=Math.floor(o/i.stepSize);r=o-c*i.stepSize,R.forEach(function(t){for(var e=c;e--;)t.state=rk4Integrate(pendulumEoms,t.config.timeScale*i.stepSize,t.state);t.trajectory=R.take(t.config.trajectoryLength,R.prepend(jointCoordinates(t.state)[3],t.trajectory))},a)}R.forEach(function(t){t.justHit&&(t.pads[t.note].className="pad padAnimate");var e=checkNotes(t);t.note=e.note,t.justHit=e.justHit,t.justHit&&(hitNote(t.synth,t.note),t.pads[t.note].className="pad"),drawPendulum(t.ctx,t.canvasWidth,t.state,t.trajectory)},a),window.requestAnimationFrame(function(t){simulate(e,t,r,a,i)})}function checkNotes(t){var e=t.config,n=t.state,a=(t.pads,t.synth),i=jointCoordinates(n)[3];if(i.y>e.kbdHeight-3)return{note:null,justHit:!1};var o=Math.floor(a.notes.length*(e.kbdWidth/2+i.x)/e.kbdWidth);return o=Math.max(Math.min(o,a.notes.length-1),0),{note:o,justHit:t.note!==o}}var vecAdd=R.zipWith(R.add),halfPi=Math.PI/2,config={stepSize:10,lockupLimit:500,pendulums:[{container:"melodyContainer",initialState:{means:[halfPi+.3,halfPi+.3,halfPi+.3,0,0,0],deltas:[.1,.2,.3,0,0,0]},timeScale:.003,trajectoryLength:70,kbdWidth:5.7,kbdHeight:2,synthParams:{gain:.2,baseFreq:440,tuning:[0,1,3,5,7,8,10,12],envelope:{attack:.015,release:.35},harmonics:[.3,.1,.3,.1,.3]}},{container:"bassContainer",initialState:{means:[halfPi,halfPi,halfPi,0,0,0],deltas:[.1,.2,.3,0,0,0]},timeScale:.002,trajectoryLength:70,kbdWidth:5.7,kbdHeight:2.5,synthParams:{gain:.2,baseFreq:110,tuning:[0,5,7,12],envelope:{attack:.03,release:.7},harmonics:[.2,.3,.2,.15,.1]}}]};window.addEventListener("load",function(){function t(){R.forEach(function(t){var e=setupCanvas(t.canvas);t.ctx=e.ctx,t.canvasWidth=e.width},n)}var e=new window.AudioContext,n=R.map(function(t){var n=document.getElementById(t.container),a=n.getElementsByTagName("canvas")[0],i=createPads(n,t.kbdWidth,t.kbdHeight,3-t.kbdWidth/2,t.synthParams.tuning.length),o=t.synthParams,r=createSynth(e,o.baseFreq,o.tuning,o.harmonics,o.envelope);r.master.gain.value=o.gain,r.master.connect(e.destination);var c=R.zipWith(function(t,e){return t+e*(2*Math.random()-1)},t.initialState.means,t.initialState.deltas);return{config:t,canvas:a,pads:i,synth:r,state:c,note:null,justHit:!1,trajectory:[]}},config.pendulums);t(),window.addEventListener("resize",t),window.requestAnimationFrame(function(t){simulate(t,t,0,n,{lockupLimit:config.lockupLimit,stepSize:config.stepSize})})});