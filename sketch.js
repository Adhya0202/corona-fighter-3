/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;

life = 185;
var gameState = PLAY;


var coronaBg, invisiblecoronaBg;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  girl_running =   loadAnimation("assets/right-1.png","assets/right-2.png","assets/right-3.png","assets/right-4.png");
  girl_collided = loadAnimation("assets/kangaroo1.png");
  coronaBgImage = loadImage("assets/background.jpg");
  mask = loadImage("assets/mask5.png");
  fruits = loadImage("assets/fruits2.png");
  sanitizer = loadImage("assets/sanitizer.png");
  obstacle1 = loadImage("assets/corona virus.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
  bullet = loadImage("assets/injection.png")
  left = loadImage("assets/original.png")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  

  girl = createSprite(windowWidth-100,350,20,50);
  girl.addAnimation("running", girl_running);
  girl.addAnimation("collided", girl_collided);
  girl.scale = 0.8;
  girl.setCollider("rectangle",0,0,120,240)
  girl.debug = false;
  
    
  invisibleGround = createSprite(400,650,1600,10);
  invisibleGround.visible = false;
  
  pointsGroup = new Group();
  obstaclesGroup = new Group();
  rightInjectionGroup = new Group();
 

  score = 0;

}

function draw() {
  background("pink");
  
  
  girl.visible = true;
  
  console.log(windowWidth,windowHeight)
  girl.x=camera.position.x-270;
   
  if (gameState===PLAY){

    if(keyDown("space")&& girl.y>260) {
    jumpSound.play();
    girl.velocityY = -16
  }
  
  if (keyDown("right")){
    shootRight();
  }
  
  
  
  girl.velocityY = girl.velocityY + 0.8
  spawnPoints();
    spawnObstacles();

    girl.collide(invisibleGround);
    
    
    if(life <= 0){
      gameState = END;
    }
    
    
    if(obstaclesGroup.isTouching(girl)){
      collidedSound.play();
      
      if(life > 0 ){
        life -= 185/4;
      }
      obstaclesGroup.destroyEach();
    }
    
    if(pointsGroup.isTouching(girl)){
      score = score+1
      pointsGroup.destroyEach();
      
      
    }
    
    
    if(rightInjectionGroup.isTouching(obstaclesGroup)){
      obstaclesGroup.destroyEach();
      rightInjectionGroup.destroyEach();
      if(life < 185){
        life += 185/4;
      }
    }


    

    if(rightInjectionGroup.isTouching(pointsGroup)){
      pointsGroup.destroyEach();
      rightInjectionGroup.destroyEach();
      if(score > 0){
        score = score-1
      }
      if(life > 0){
        life -= 185/4;
      }
    }


   


    
    
  }
  else if (gameState === END) {
    //set velcity of each game object to 0
    girl.destroy();
    
    obstaclesGroup.setVelocityXEach(0);
    pointsGroup.setVelocityXEach(0);
    
    swal(
      {
        title: `Game Over`,
        text: "Oopps you got infected...isolate and take rest!!!",
       

        imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        
      confirmButtonText: "Play Again",

    },
    function(isConfirm){
      if(isConfirm) {
        location.reload();
      }
    }
    
    );

   
  }

  
  drawSprites();


  textSize(20)
  stroke(3)
  fill("black")
  text("score:  "+score,camera.position.x,50)

  showLife();

  if(score>=10){
    girl.visible= false;
    textSize(30) 
    stroke(3)
    swal({
      title: `YAY!!!`,
      text: "You are safe fron the virus",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "fight again"
    },
    function(isConfirm){
      if(isConfirm) {
        location.reload();
      }
    }
    
    );
    gameState = WIN
    girl.velocityY = 0;
   
    obstaclesGroup.setVelocityXEach(0);
    pointsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    pointsGroup.setLifetimeEach(-1);
  }
}

function spawnPoints() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {

    var point = createSprite(camera.position.x+500,330,40,10);
   
    
    point.velocityX = -(6 + 3*score/100)
    

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: point.addImage(mask);
             point.scale = 1;
              break;
      
      case 2: point.addImage(sanitizer);
              point.scale = 0.20;
              break;
              
              case 3: point.addImage(fruits);
              point.scale = 0.20;
              break;
    }
    
    //assign scale and lifetime to the point           
  
     //assign lifetime to the variable
    point.lifetime = 400;
    
    point.setCollider("rectangle",0,0,point.width/2,point.height/2)
    //add each cloud to the group
    pointsGroup.add(point);
    
  }
  
}
function restart(){
  location.reload();
}
function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+500,330,40,10);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX =random(-(6 + 3*score/100))
    obstacle.scale = 0.15;
    //assign scale and lifetime to the obstacle           
      
    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
  }
}

 function showLife() {
  push();
  
  fill("white");
  rect(camera.position.x - 200 ,40, 185, 20);
  fill("#f50057");
  rect(camera.position.x - 200 ,40, life, 20);
  noStroke();
  pop();
}

function shootRight(){
  rightInjection = createSprite(girl.x,girl.y,50,50)
  rightInjection.addImage(bullet)
  rightInjection.scale = 0.1
  rightInjection.velocityX = 7
  rightInjectionGroup.add(rightInjection);
}


