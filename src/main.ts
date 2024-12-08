import { Vec3 } from "./vector3.js";
import { Point,Spring,Mass,SpringConstant,Length,Time, gravity } from "./model.js";
import { Render2 } from "./render.js";


let Points: Point[] = [];
let Springs: Spring[] = [];
let render: Render2;
let step: Time = 0.01;

function circle() { // 環状のモデル
    const mass: Mass = 100000000000000;
    Points = [
        new Point(new Vec3(0,0,0),mass*1000),
        new Point(new Vec3(100,0,0),mass),
        new Point(new Vec3(0,100,0),mass),
        new Point(new Vec3(0,500,0),mass/100),
        new Point(new Vec3(500,0,0),mass),
    ]
    {
        Points[1].v[1] = -300;
        Points[2].v[0] = 200;
        Points[3].v[0] = 20;
        Points[4].v[1] = 120;
    }
    // Springs = new Array(num-1).fill(0).map((x,i)=>new Spring(k,l,Points[i],Points[i+1]));
    // Springs.push(new Spring(k,l,Points[0],Points[num-1]))

    step = 0.001;
    render = new Render2(document.querySelector("#output")!,1800,800,new Vec3(0,100,0),0.5);
}

circle();

var speed = 1;

var t: Time = 0;
var before: Time = Number(new Date())+1000;
function loop() {
    var dt: Time = Number(new Date()) - before;
    before = Number(new Date());
    for (let i=0;i<dt/1000/step*speed;i++) {
        t += step;
        for (let spring of Springs) {
            spring.affect();
        }
        gravity(Points);
        for (let point of Points) {
            point.updatePosition(t,step);
        }
    }
    render.render(t,Points,Springs);
    requestAnimationFrame(loop);
}

console.log(step);
loop();