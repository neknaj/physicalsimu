import { Vec3 } from "./vector3.js";
import { Point,Spring,Mass,SpringConstant,Length,Time,step } from "./model.js";
import { Render2 } from "./render.js";


let Points: Point[];
let Springs: Spring[];

const mass: Mass = 1;
const k: SpringConstant = 10000;
const l: Length = 5;
const num = 500;
Points = new Array(num).fill(0).map((x,i)=>new Point(new Vec3(i*10,1,0),mass));
{
    Points[0].updatePosition = (t:Time)=>{Points[0].r.y = Math.sin(t*5)*100;};
    Points[num-1].m = 100000000;
}
Springs = new Array(num-1).fill(0).map((x,i)=>new Spring(k,l,Points[i],Points[i+1]));

let render = new Render2(document.querySelector("#output")!,1800,500,[2500,0],0.35);

var speed = 1;

var t: Time = 0;
var before: Time = Number(new Date());
function loop() {
    var dt: Time = Number(new Date()) - before;
    before = Number(new Date());
    for (let i=0;i<dt/1000/step*speed;i++) {
        t += step;
        for (let spring of Springs) {
            spring.affect();
        }
        for (let point of Points) {
            point.updatePosition(t);
        }
    }
    render.render(t,Points,Springs);
    requestAnimationFrame(loop);
}

loop();