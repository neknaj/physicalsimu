import { Vec3 } from "./vector3.js";
import { Point,Spring,Mass,Time, Gravity, Length, SpringConstant } from "./model.js";
import { Render2, RenderConfig } from "./render.js";

const modelName: string = sessionStorage.getItem("physicalsimu_model")?
                            sessionStorage.getItem("physicalsimu_model")!:"planet";

if (modelName=="planet") { // 惑星
    let Points: Point[] = [];
    let Springs: Spring[] = [];
    let render: Render2;
    let step: Time = 0.01;
    const renderconfig: RenderConfig = {
        gravitational_field: true,
        springs: true,
        velocity: true,
        acceleration: true,
        trajectory: true,
    }

    function planet() { // 惑星のモデル
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
            Points[0].v[1] = -11.6;
            Points[0].v[0] = -0.2;
            Points[1].v[1] = -300;
            Points[2].v[0] = 200;
            Points[3].v[0] = 50;
            Points[4].v[1] = 120;
        }
        // Springs = new Array(num-1).fill(0).map((x,i)=>new Spring(k,l,Points[i],Points[i+1]));
        // Springs.push(new Spring(k,500,Points[0],Points[4])) // 星をバネで繋ぐ

        step = 0.001;
        render = new Render2(document.querySelector("#output")!,900,800,new Vec3(0,100,0),0.5,renderconfig);
    }


    planet();

    let gravity = new Gravity(Points);

    var speed = 2;

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
}

if (modelName=="wave") { // 平面波
    let Points: Point[] = [];
    let Springs: Spring[] = [];
    let render: Render2;
    let step: Time = 0.01;
    const renderconfig: RenderConfig = {
        gravitational_field: false,
        springs: true,
        velocity: false,
        acceleration: false,
        trajectory: true,
    }

    function net() { // 網状のモデル
        const mass: Mass = 1000;
        const k: SpringConstant = 200;
        const l: Length = 0;
        const numx = 100;
        const numy = 100;
        Points = new Array(numx*numy).fill(0).map((x,i)=>new Point(new Vec3((i%numx)*10,(i-i%numx)/numx*10,0),mass));
        Points[numy*2/5*numx].updatePosition = (t:Time)=>{Points[numy*2/5*numx].r.x = Math.sin(t*0.5)*50;};
        Points[numy*3/5*numx].updatePosition = (t:Time)=>{Points[numy*3/5*numx].r.x = Math.sin(t*0.5)*50;};
        for (let y=0;y<numy;y++) {
            Points[0+y*numy].m = 10000000000;
            Points[(numx-1)+y*numy].m = 10000000000;
        }
        for (let x=0;x<numx;x++) {
            Points[x+0*numx].m = 100000000;
            Points[x+(numy-1)*numx].m = 100000000;
        }
        Springs = [];
        for (let x=0;x<numx;x++) {
            for (let y=0;y<numy-1;y++) {
                Springs.push(new Spring(k,l,Points[x+y*numx],Points[x+(y+1)*numx]));
            }
        }
        for (let x=0;x<numx-1;x++) {
            for (let y=0;y<numy;y++) {
                Springs.push(new Spring(k,l,Points[x+y*numx],Points[(x+1)+y*numx]));
            }
        }

        step = 0.1;
        render = new Render2(document.querySelector("#output")!,800,800,new Vec3(500,500,0),0.7,renderconfig);
        // render = new Render2(document.querySelector("#output")!,900,900,[500,500],5);
        // render = new Render2(document.querySelector("#output")!,900,900,[0,0],5);
    }

    net();

    let gravity = new Gravity();

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
            for (let point of Points) {
                point.updatePosition(t,step);
            }
        }
        render.render(t,Points,gravity,Springs);
        requestAnimationFrame(loop);
    }

    console.log(step);
    loop();
}