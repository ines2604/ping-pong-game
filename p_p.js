let can=document.getElementById("table");
let draw_ = can.getContext('2d');

/*draw_.fillStyle="black";
draw_.fillRect(0,0,can.width ,can.height);

draw_.fillStyle="red";
draw_.fillRect(100,100,30,30);

draw_.fillStyle="orange";
draw_.beginPath();
draw_.arc(200,200,10,0,Math.PI*2,false);
draw_.closePath();
draw_.fill();*/

const ball={
    x: can.width/2,
    y: can.height/2,
    radius:10,
    velx:5,
    vely:5,
    speed:5,
    color:"green"
}
const Separator={
    x: (can.width -2)/2,
    y:0,
    height:10,
    width:2,
    color: "white"
}
const User_Bar={
    x:0,
    y: (can.height-100)/2,
    width:10,
    height:100,
    score:0,
    color: "RED"
}
const CPU_Bar={
    x:can.width-10,
    y: (can.height-100)/2,
    width:10,
    height:100,
    score:0,
    color: "RED"
}
function drawRectangle(x,y,w,h,color){
    draw_.fillStyle=color;
    draw_.fillRect(x,y,w,h);
}
function drawCircle(x,y,r,color){
    draw_.fillStyle=color;
    draw_.beginPath();
    draw_.arc(x,y,r,0,Math.PI*2,false)
    draw_.closePath();
    draw_.fill();
}
function drawScore(text,x,y){
    draw_.fillStyle="white";
    draw_.font="60px Arial";
    draw_.fillText(text,x,y);
}
function drawSeparator(){
    for (let i=0 ;i<=can.height ;i+=20){
        drawRectangle(Separator.x,Separator.y+i,Separator.width,Separator.height,Separator.color);
    }
}
function helper() {
    drawRectangle(0, 0, can.width, can.height, "black");
    drawScore(User_Bar.score, can.width / 4, can.height / 5);
    drawScore(CPU_Bar.score, 3 * can.width / 4, can.height / 5);
    drawSeparator();
    drawRectangle(User_Bar.x, User_Bar.y, User_Bar.width, User_Bar.height, User_Bar.color);
    drawRectangle(CPU_Bar.x, CPU_Bar.y, CPU_Bar.width, CPU_Bar.height, CPU_Bar.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
function restart(){
    ball.x=can.width/2;
    ball.y=can .height/2;
    ball.velx=-ball.velx;
    ball.speed=5;
}
function getMousePos(evt){
    let rect =can.getBoundingClientRect();
    User_Bar.y=evt.clientY-rect.top-User_Bar.height/2;
}
function cpu_movement() {
    if (CPU_Bar.y + CPU_Bar.height / 2 < ball.y) {
        CPU_Bar.y += 5;
    } else {
        CPU_Bar.y -= 5;
    }
}
function call_back(){
    updates();
    helper();
}
function detect_collosion(ball,player){
    player.top=player.y;
    player.bottom=player.y+player.height;
    player.left=player.x;
    player.right=player.x+player.width;

    ball.top=ball.y-ball.radius;
    ball.bottom=ball.y+ball.radius;
    ball.left=ball.x-ball.radius;
    ball.right=ball.x+ball.radius;

    return player.left<ball.right && player.top < ball.bottom && player.right>ball.left && player.bottom>ball.top;
}
function updates(){
    if (ball.x-ball.radius<0){
        CPU_Bar.score++;
        restart();
    }
    else if(ball.x+ball.radius > can.width){
        User_Bar.score++;
        restart();
    }
    ball.x+=ball.velx;
    ball.y+=ball.vely;

    cpu_movement();


    if(ball.y-ball.radius<0 || ball.y+ball.radius>can.height){
        ball.vely=-ball.vely;
    }
    let player =(ball.x+ball.radius<can.width/2)? User_Bar:CPU_Bar;

    if(detect_collosion(ball,player)){
        let collidePoint=(ball.y-(player.y+player.height/2));
        collidePoint =collidePoint/(player.height/2);
        
        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x + ball.radius < can.width / 2) ? 1 : -1;
        ball.velx = direction * ball.speed * Math.cos(angleRad);
        ball.vely = ball.speed * Math.sin(angleRad);

        ball.speed+=0.1;
    }
}

can.addEventListener("mousemove",getMousePos);
let fps=50;
let looper=setInterval(call_back,1000/fps);