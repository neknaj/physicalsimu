import { Vec3 } from "./vector3.js";
import { Point,Spring,Mass,Time, Gravity, SpringConstant } from "./model.js";
import { Render2 } from "./render.js";


let Points: Point[] = [];
let Springs: Spring[] = [];
let render: Render2;
let step: Time = 0.01;

function circle() { // 環状のモデル
    const mass: Mass = 100000000000000;
    const k: SpringConstant = 100000000000000000;
    Points = [
        new Point(new Vec3(0,0,0),mass*1000),
        new Point(new Vec3(100,0,0),mass),
        new Point(new Vec3(0,100,0),mass),
        new Point(new Vec3(0,500,0),mass/100),
        new Point(new Vec3(500,0,0),mass*100),
    ]
    {
        Points[0].v[1] = -10;
        Points[1].v[1] = -300;
        Points[2].v[0] = 200;
        Points[3].v[0] = 50;
        Points[4].v[1] = 120;
    }
    // Springs = new Array(num-1).fill(0).map((x,i)=>new Spring(k,l,Points[i],Points[i+1]));
    // Springs.push(new Spring(k,500,Points[0],Points[4])) // 星をバネで繋ぐ

    step = 0.001;
    render = new Render2(document.querySelector("#output")!,1800,800,new Vec3(0,100,0),0.5);
}

circle();

let gravity = new Gravity(Points);

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
        gravity.affect();
        for (let point of Points) {
            point.updatePosition(t,step);
            if (i%10==0) {
                point.saveTrajectory();
            }
        }
    }
    render.render(t,Points,gravity,Springs);
    requestAnimationFrame(loop);
}

console.log(step);
loop();