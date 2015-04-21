//functions for take photo div are here

var i, ctF, ctT, full, thumb, w, h, aspectRatio;

//imgSuccess after navigator.camera.getPicture
function imgSuccess(fileURI){
	full = document.getElementById("full");
	thumb = document.createElement("canvas");
	i = document.createElement("img");
	i.addEventListener("load", setCanvas);
	i.crossOrigin = "Anonymous";
	i.src = fileURI;
	
	uncheckRadioBtn();
	
	document.getElementById("setBtn").addEventListener("click", addText);
	document.getElementById("saveBtn").addEventListener("click", upload);
}
//imgFail after navigator.camera.getPicture
function imgFail(message){
	 alert('Failed because: '+ message);
}
//imgOptions after navigator.camera.getPicture, but I found the settings are not helpful
var imgOptions = {
	/*quality : 100,
	destinationType: Camera.DestinationType.FILE_URI,
	sourceType: Camera.PictureSourceType.CAMERA,
	allowEdit : true,
	encodingType : Camera.EncodingType.JPEG,
	mediaType: Camera.MediaType.PICTURE,
	targetWidth : 100,
	targetHeight : 100,
	cameraDirection : Camera.Direction.FRONT,
	saveToPhotoAlbum : false*/
}
//set up canvas portrait, in config file we forced the orientation into landscape
function setCanvas(ev){
	//image has been loaded
	w = i.width;
	h = i.height;
	aspectRatio = w/h;
	//full image
	full.height = 500;
	full.style.height = "500px";
	var fw = 500 * aspectRatio;
	full.width = fw;
	full.style.width = fw + "px";
	i.width = fw;
	i.height = 500;
	ctF = full.getContext('2d');
	ctF.drawImage(i, 0, 0, fw, 500);
	//thumbnail
	thumb.height = 200;
	thumb.style.height = "200px";
	var tw = 200 * aspectRatio;
	thumb.width = tw;
	thumb.style.width = tw + "px";
	i.width = tw;
	i.height = 200;
	ctT = thumb.getContext('2d');
	ctT.drawImage(i, 0, 0, tw, 200);
	
}
//set up canvas landscape for tablet size
/*function setCanvas(ev){
	//image has been loaded
	w = i.width;
	h = i.height;
	aspectRatio = w/h;
	//full image
	full.width = 500;
	full.style.width = "500px";
	var fh = 500 * aspectRatio;
	full.height = fh;
	full.style.height = fh + "px";
	i.height = fh;
	i.width = 500;
	ctF = full.getContext('2d');
	ctF.drawImage(i, 0, 0, 500, fh);
	//thumbnail
	thumb.width = 200;
	thumb.style.width = "200px";
	var th = 200 * aspectRatio;
	thumb.height = th;
	thumb.style.height = th + "px";
	i.height = th;
	i.width = 200;
	ctT = thumb.getContext('2d');
	ctT.drawImage(i, 0, 0, 200, th);
}*/
//set up canvas landscape for cell phone size
/*function setCanvas(ev){
	//image has been loaded
	w = i.width;
	h = i.height;
	aspectRatio = w/h;
	//full image
	full.width = 300;
	full.style.width = "300px";
	var fh = 300 * aspectRatio;
	full.height = fh;
	full.style.height = fh + "px";
	i.height = fh;
	i.width = 300;
	ctF = full.getContext('2d');
	ctF.drawImage(i, 0, 0, 300, fh);
	//thumbnail
	thumb.width = 200;
	thumb.style.width = "200px";
	var th = 200 * aspectRatio;
	thumb.height = th;
	thumb.style.height = th + "px";
	i.height = th;
	i.width = 200;
	ctT = thumb.getContext('2d');
	ctT.drawImage(i, 0, 0, 200, th);
	
}*/
//upload img to the database after clicking save img button
function upload(ev){
	alert("img uploaded");
	var fullpng = full.toDataURL("image/png");
	var thumbpng = thumb.toDataURL("image/png");
	fullpng = encodeURIComponent( fullpng );
	thumbpng = encodeURIComponent( thumbpng );
	var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/save.php";
	var postData = "dev="+device.uuid+"&thumb=" + thumbpng + "&img=" + fullpng;
	sendRequest(url, imgSaved, postData);
}
//display a message after img successfully saved inot database
function imgSaved(xhr){
	alert(xhr.responseText);
}
//adding text to the img
function addText(ev){
	var txt = document.getElementById("textInput").value;
	if(txt != ""){
		//clear the canvas
		ctF.clearRect(0, 0, full.width, full.height);
		//reload the image
		var w = full.width;
		var h = full.height;
		ctF.drawImage(i, 0, 0, w, h);
		//add the new text to the image
		var middle = full.width / 2;
		var toptxt = full.height - 400;
		var bottomtxt = full.height - 100;
		ctF.font = "30px sans-serif";
		ctF.fillStyle = "red";
		ctF.strokeStyle = "gold";
		ctF.textAlign = "center";
		//adding text on canvas and text wrapping conditions
		var words = txt.split(" ");
		var line = "";
		for(var n = 0; n < words.length; n++){
			var testLine = line + words[n] + " ";
			var metrics = ctF.measureText(testLine);
			var testWidth = metrics.width;
			if(testWidth > full.width && n >0){
				if(document.getElementById("topBtn").checked){
					ctF.fillText(line, middle, toptxt);
					ctF.strokeText(line, middle, toptxt);
					line = words[n] + " ";
					toptxt += 25;
				}
				else if(document.getElementById("bottomBtn").checked){
					ctF.fillText(line, middle, bottomtxt);
					ctF.strokeText(line, middle, bottomtxt);
					line = words[n] + " ";
					bottomtxt += 25;
				}
			}else{
				line = testLine;
			}
		}
		if(document.getElementById("topBtn").checked){
			ctF.fillText(line, middle, toptxt);
			ctF.strokeText(line, middle, toptxt);
			line = words[n] + " ";
			toptxt += 25;
		}
		else if(document.getElementById("bottomBtn").checked){
			ctF.fillText(line, middle, bottomtxt);
			ctF.strokeText(line, middle, bottomtxt);
			line = words[n] + " ";
			bottomtxt += 25;
		}
	}
}
//make sure only one radio button is selected each time
function uncheckRadioBtn(){
	var myRadios = document.getElementsByName("radioBtn");
	var setCheck;
	var x = 0;
	for(x = 0; x < myRadios.length; x++){
	 
			myRadios[x].onclick = function(){
				if(setCheck != this){
					 setCheck = this;
				}else{
					this.checked = false;
					setCheck = null;
				}
			};
	}
}
