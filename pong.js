const cvs=document.getElementById("ping");
const ctx=cvs.getContext("2d");

const user={
    x:0,
    y: cvs.height/2 - 100/2,
    width:10,
    height:100,
    color:"WHITE",
    score:0
}
const com={
    x:cvs.width-10,
    y: cvs.height/2 - 100/2,
    width:10,
    height:100,
    color:"WHITE",
    score:0
}
const ball={
    x:cvs.width/2,
    y:cvs.height/2,
    radius:10,
    speed:5,
    velocityX:5,
    velocityY:5,
    color:"WHITE"
}

function drawRect(x,y,w,h,color){
    ctx.fillStyle= color;
    ctx.fillRect(x,y,w,h);
}

const net={
    x:cvs.width/2-1,
    y:0,
    width:2,
    height:10,
    color:"WHITE"
}

function drawNet(){
    for(let i=0;i<=cvs.height;i+=15){
        drawRect(net.x,net.y+i,net.width,net.height,net.color);
    }
}

//draw  circle
function drawCircle(x,y,r,color){
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}

drawCircle(100,100,50,"WHITE");

function drawText(text,x,y,color){
    ctx.fillStyle=color;
    ctx.font="45px fantasy";
    ctx.fillText(text,x,y);
}

drawText("something",300,200,"WHITE");

function render(){
    drawRect(0,0,cvs.width,cvs.height,"BLACK");

    drawNet();

    drawText(user.score,cvs.width/4,cvs.height/5,"WHITE");
    drawText(com.score,3*cvs.width/4,cvs.height/5,"WHITE");

    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(com.x,com.y,com.width,com.height,com.color);

    drawCircle(ball.x,ball.y,ball.radius,ball.color);
}

cvs.addEventListener("mousemove",movePaddle);

function movePaddle(evt){
    let rect=cvs.getBoundingClientRect();

    user.y=evt.clientY-rect.top-user.height/2;
}

function collision(b,p){
    b.top=b.y-b.radius;
    b.bottom=b.y+b.radius;
    b.left=b.x-b.radius;
    b.right=b.x+b.radius;

    p.top=p.y;
    p.bottom=p.y+p.height;
    p.left=p.x;
    p.right=p.x+p.width;

    return b.right>p.left && b.bottom>p.top && b.left<p.right &&b.top<p.bottom;
}

function resetBall(){
    ball.x=cvs.width/2;
    ball.y=cvs.height/2;

    ball.speed=5;
    ball.velocityX= -ball.velocityX;
}

function update(){
    ball.x+=ball.velocityX;
    ball.y+=ball.velocityY;

    let computerLevel=0.1;
    com.y+=(ball.y-(com.y+com.height/2))*computerLevel;

    if((ball.y + ball.radius)>cvs.height || (ball.y-ball.radius)<0){
        ball.velocityY= -ball.velocityY;
    }
    let player=(ball.x<cvs.width/2)?user:com;

    if(collision(ball,player)){

        let collidePoint=ball.y-(player.y+player.height/2);
        collidePoint=collidePoint/player.height/2;

        let angleRad=collidePoint*Math.PI/4;

        let direction =(ball.x<cvs.width/2)?1:-1;

        ball.velocityX= direction*ball.speed*Math.cos(angleRad);
        ball.velocityY= ball.speed*Math.cos(angleRad);

        ball.speed+=0.5;
    }

    if(ball.x-ball.radius<0){
        com.score++;
        resetBall();
    }else if(ball.x+ball.radius>cvs.width){
        user.score++;
        resetBall();
    }
}
function game(){
    update();
    render();
}

const framePerSecond=50;
setInterval(game,1000/framePerSecond);
