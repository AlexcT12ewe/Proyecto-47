var PLAY = 1;
var END = 0;
var gameState = PLAY;

var dib, dib_walking, dib_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4,obstacle5;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadAnimation("Imagenes/Fondo-1.png", "Imagenes/Fondo-3.png","Imagenes/Fondo-5.png","Imagenes/Fondo-7.png","Imagenes/Fondo-9.png");
  //backgroundImg.playing = true;
  //backgroundImg.frameDelay = 25;
  sunAnimation = loadImage("sun.png");
  
  dib_walking = loadAnimation("Imagenes/Dib1.png","Imagenes/Dib2.png","Imagenes/Dib3.png","Imagenes/Dib4.png","Imagenes/Dib5.png");
  dib_collided = loadAnimation("Imagenes/derrota.png");
  
  groundImage = loadImage("Imagenes/Piso1.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("Imagenes/Basura.png");
  obstacle2 = loadImage("Imagenes/Cerdito.png");
  obstacle3 = loadImage("Imagenes/Gir.png");
  obstacle4 = loadImage("Imagenes/MiniAlce.png");
  obstacle5 = loadImage("Imagenes/Pelota.png");
  

  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  Background = createSprite(0,0,width+100,height+100);
  Background.scale=7;
  Background.addAnimation("Fondo",backgroundImg);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  dib = createSprite(50,height-13,20,50);
  dib.addAnimation("walking", dib_walking);
  dib.addAnimation("collided", dib_collided);
  dib.setCollider('circle',0,0,200)
  dib.scale = 0.6
  dib.debug=false
  
  invisibleGround = createSprite(width/2,height,width,125);  
  invisibleGround.visible = false;
  
  ground = createSprite(width/2,height-45,width+100,2);
  ground.addImage("Piso",groundImage);
  ground.scale =1.8;
  //ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  ground.depth = dib.depth;
  dib.depth = dib.depth+1;
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(0);
  drawSprites();
  ///image(backgroundImg,0,0,width,height);
  textSize(40);
  stroke("purple")
  fill("black")
  text("Puntaje: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && dib.y  >= height-400) {
      jumpSound.play( )
      dib.velocityY = -10;
       touches = [];
    }
    //aqui poner movimientos con flechas
    if(keyDown("right")){
      dib.x = dib.x + 10;
    }

    if(keyDown("left")){
      dib.x = dib.x - 10;
    }
  
    dib.velocityY = dib.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    dib.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnObstacles2();
  
    if(obstaclesGroup.isTouching(dib)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //establecer velocidad para cada objeto del juego en 0
    ground.velocityX = 0;
    dib.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityYEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //cambiar la animación del trex
    dib.changeAnimation("collided",dib_collided);
    
    //establecer tiempo de vida a los objetos del juego para que nunca se destruyan.
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")||mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }
  
  
}

function spawnClouds() {
  //escribir código aquí para aparecer nubes.
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(4 + 3*score/100);
    
     //asignar tiempo de vida a la variable
    cloud.lifetime = 800;
    
    //ajustar la profundidad.
    //cloud.depth = trex.depth;
    //trex.depth = trex.depth+1;
    
    //agregar cada nube a un grupo.
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite((random(1,width)),0,20,30);
    obstacle.setCollider('circle',0,0,45)
    obstacle.debug = true
  
    obstacle.velocityY = (6 + 3*score/100);
    
    //generar obstáculos aleatorios.
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle5);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //asignar tamaño y tiempo de vida al obstáculo.           
    obstacle.scale = 0.2;
    obstacle.lifetime = 100;
    //obstacle.depth = trex.depth;
    //trex.depth +=1;
    //agregar cada obstáculo a cada grupo.
    obstaclesGroup.add(obstacle);
  }
}

function spawnObstacles2() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite (width,660,20,30);
    obstacle.setCollider('circle',0,0,45)
    obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generar obstáculos aleatorios.
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle4);
              break;
      case 2: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //asignar tamaño y tiempo de vida al obstáculo.           
    obstacle.scale = 0.3;
    obstacle.lifetime = 1000;
    //obstacle.depth = trex.depth;
    //trex.depth +=1;
    //agregar cada obstáculo a cada grupo.
    obstaclesGroup.add(obstacle);
  }
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  dib.changeAnimation("walking",dib_walking);
  
  score = 0;
  
}
