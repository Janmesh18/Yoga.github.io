/* ===
ml5 Example
KNN Classification on Webcam Images with poseNet. Built with p5.js
=== */
let video;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let poseNet;
let poses = [];
let canvas;
let width = 700;
let height = 500;
let ctx;
let res_conf;
var audio=null;
var twenty_frames=[];
var counts = {};
var pose_arr=['A','B','C','D','E'];
let prev_sound='K';
counts['A']=0;
counts['B']=0;
counts['C']=0;
counts['D']=0;
counts['E']=0;
var p_name=null;
var alpha;


poses_name=['Utkata Konasana (goddess)','Tadasana (mountain)','Phalakasana (plank)','Vrksasana (tree)','Virabhadrasana III (warrior 3)']

function setup() {
    let cnv=createCanvas(700, 500);
    cnv.position(700, 50);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();





  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  knnClassifier.load('myKNN.json',classifierReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  
  requestAnimationFrame(draw)
}





function classifierReady()
{ 
     console.log("Classifier model is ready!");
     document.querySelector('#status').textContent = 'Classifier loaded!'
}
function draw() {
 

  image(video, 0, 0, width, height);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  if(p_name!=null){
    textSize(34);
    text(p_name, 10, 30);
  }
}




function modelReady(){
  document.querySelector('#status').textContent = 'model Loaded'
}

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  if(poses.length>0){

    console.log("Got pose length!");
  // Convert poses results to a 2d array [[score0, x0, y0],...,[score16, x16, y16]]
  const poseArray = poses[0].pose.keypoints.map(p => [p.score, p.position.x, p.position.y]);

  // Use knnClassifier to classify which label do these features belong to
  // You can pass in a callback function `gotResults` to knnClassifier.classify function
  knnClassifier.classify(poseArray, gotResults);
  }
}


// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    console.log(confidences);

    let c_a = confidences['A'] * 100;
    let c_b = confidences['B'] * 100;
    let c_c = confidences['C']*100;

    let c_d = confidences['D']*100;
    let c_e = confidences['E']*100;

    console.log(c_a,c_b,c_c,c_d,c_e);


   var conf = [];
   conf.push(c_a);
   conf.push(c_b);
   conf.push(c_c);
   conf.push(c_d);
   conf.push(c_e);


   
   
   let mx_indx = conf.indexOf(Math.max(...conf));
   console.log(mx_indx);

   twenty_frames.push(pose_arr[mx_indx]);
   console.log(pose_arr[mx_indx]);
   counts[pose_arr[mx_indx]]+=1;

   if(twenty_frames.length>100){
    
    let maxi=0;
    let res;

    for(var i=0;i<twenty_frames.length;i++){
      console.log(twenty_frames[i]);
      correction(twenty_frames[i]);
      console.log(counts[twenty_frames[i]]);

      if(counts[twenty_frames[i]]>maxi){
         maxi=counts[twenty_frames[i]];
         res=twenty_frames[i];
      }  
    }
    last_frame=twenty_frames.shift();
    console.log(res);

    sound_no=pose_arr.indexOf(res)+1;
    console.log('Sound number'+sound_no);

    counts[last_frame]-=1;

    if(prev_sound!=res){
      if(audio!=null){
      audio.pause();
      }
      audio = new Audio('assets/'+sound_no.toString()+'.mp3');
      audio.play();
      prev_sound=res;
      p_name= poses_name[sound_no-1];

      console.log("poses"+p_name);


      

    }



   }





  
  // document.querySelector('#result').textContent = res_conf;
   //document.querySelector('#confidence').textContent = `${confidences[res_conf] * 100} %`;


     //document.querySelector('#confidenceA').textContent = `${confidences['chaturanga'] ? confidences['chaturanga'] * 100 : 0} %`;
     //document.querySelector('#confidenceB').textContent = `${confidences['downdog'] ? confidences['downdog'] * 100 : 0} %`;
  //   document.querySelector('#confidenceC').textContent = `${confidences['sukhasana'] ? confidences['sukhasana'] * 100 : 0} %`;
  }

  
}



//=======Draw skeleton and keypoints ===/

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {


    if(poses.length>0){
      console.log("Got pose in drawing function!");
      classify();
    }
   // Loop through all the poses detected
   for (let i = 0; i < poses.length; i++) {
     // For each pose detected, loop through all the keypoints
     for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
       // A keypoint is an object describing a body part (like rightArm or leftShoulder)
       let keypoint = poses[i].pose.keypoints[j];
       // Only draw an ellipse is the pose probability is bigger than 0.2
       if (keypoint.score > 0.1) {
         fill(255, 0, 0);
         noStroke();
         ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
 
         
       }
     }
   }
 }
 
 // A function to draw the skeletons
 function drawSkeleton() {
   // Loop through all the skeletons detected
   for (let i = 0; i < poses.length; i++) {
     // For every skeleton, loop through all body connections
     for (let j = 0; j < poses[i].skeleton.length; j++) {
       let partA = poses[i].skeleton[j][0];
       let partB = poses[i].skeleton[j][1];
       stroke(255, 0, 0);
       line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
     }
   }
 }
/*
function speak(m){ 
 var msg = new SpeechSynthesisUtterance();
 if(m=="Tadasana"){
 msg.text = "Tadasana";
 window.speechSynthesis.speak(msg);
 } else if(m=="Urdhva Hastasana"){
   msg.text="Urdhva Hastasana";
   window.speechSynthesis.speak(msg);
 } else if(m=="Uttanasana"){
  msg.text="Uttanasana";
  window.speechSynthesis.speak(msg);
} else if(m=="Ardha Uttanasana"){
  msg.text="Ardha Uttanasana";
  window.speechSynthesis.speak(msg);
} else if(m=="Chaturanga"){
  msg.text="Chaturanga";
  window.speechSynthesis.speak(msg);
} else if(m=="Urdhva Mukha Svanasana"){
  msg.text="Urdhva Mukha Svanasana";
  window.speechSynthesis.speak(msg);
}else{
  msg.text="please try yoga";
  window.speechSynthesis.speak(msg);
}
}*/
function correction(alpha){
  var n=alpha;
  var path= 'assets/'+n+'.gif' 
  var s=document.getElementById("x");
  s.innerHTML=`<img src='${path}'>`;
}

function so(){
  var au;
  au =new Audio('sound/Flute Music.mp3');
  au.play();
}
so();