import { Vec3 } from "./vector3.js";
import { Point,Spring,Mass,SpringConstant,Length } from "./model.js";
import { Render2 } from "./render.js";


let Points: Point[];
let Springs: Spring[];
let render = new Render2(document.querySelector("#output")!,1000,500,[0,0],10);

{
    const mass: Mass = 1;
    Points = [
        new Point(new Vec3(-24,0,0),mass*100000000),
        new Point(new Vec3(-10,0,0),mass),
        new Point(new Vec3(0,0,0),mass),
        new Point(new Vec3(10,0,0),mass),
        new Point(new Vec3(25,0,0),mass*100000000),
    ]
    const k: SpringConstant = 10;
    const l: Length = 6;
    Springs = [
        new Spring(k,l,Points[0],Points[1]),
        new Spring(k,l,Points[1],Points[2]),
        new Spring(k,l,Points[2],Points[3]),
        new Spring(k,l,Points[3],Points[4]),
    ]
}


function loop() {
    for (let i=0;i<1000;i++) {
        for (let spring of Springs) {
            spring.affect();
        }
        for (let point of Points) {
            point.updatePosition();
        }
    }
    render.render(Points,Springs);
    requestAnimationFrame(loop);
}

loop();