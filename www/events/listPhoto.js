
//document.addEventListener("DOMContentLoaded", onDeviceReady, false);
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	//Hammer js tap handler
	addHammerTapHandler();
	//get picture through camera API
	document.getElementById("takePhotoBtn").addEventListener("click",
		function(){
			navigator.camera.getPicture( imgSuccess, imgFail, imgOptions );});
	//show takephoto div
	var takePhoto = document.getElementById("takeBtn");
	takePhoto.addEventListener("click", function(){takePhotoPage();},false);
	//show listphoto div
	var listPhoto = document.getElementById("listBtn");
	listPhoto.addEventListener("click", function(){displayThumbnails();},false);
	//close modal
	var closeModal = document.getElementById("backBtn");
	closeModal.addEventListener("click", function(){closeModalPage();},false);
	//delete photo
	var delPho = document.querySelectorAll("deleteBtn");
	for (var i = 0; i < delPho.length; i++){
		delPho[i].addEventListener("click", function(ev){deletePhotos(ev);},false);
	}
}
//call hammer js
function addHammerTapHandler(){
	var tar = document.querySelector("[data-role=listview]");
	var mc = new Hammer (tar);
	
	mc.on("tap", function(ev){
		//console.log(ev.target);
		//console.log(ev.target.nodeName);
		//show full size img after tapping on the thumbnail img
		if(ev.target.nodeName == "IMG"){
			fetchImg(ev);
		}
		//delete both full sized img and the thumbnail from database after tapping delete btn
		else if(ev.target.nodeName == "P"){
			document.querySelector("[data-role=modal]").style.display = "none";
			document.querySelector("[data-role=overlay]").style.display = "none";
			deletePhotos(ev);
		}
	});
}
//switch to take photo div 
function takePhotoPage(ev){
	alert("take photo");
	document.getElementById("cameraPage").style.display = "block";
	document.getElementById("listPage").style.display = "none";
	document.querySelector("[data-role=modal]").style.display = "none";
	document.querySelector("[data-role=overlay]").style.display = "none";
}
//ajax call to fetch in thumbnail img
function displayThumbnails(ev){
	var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/list.php?dev="+device.uuid;
	sendRequest(url, thunmbnailReturned, null);
}
//dynamically display thumbnail imgs after successful ajax call
function thunmbnailReturned(xhr){
	var json = JSON.parse(xhr.responseText);
	alert("display all thumbnails");
	var div = document.querySelector("[data-role=listview]");
	div.innerHTML="";
	for (var i = 0; i < json.thumbnails.length; i++){
		//create a div container
		var x = document.createElement("div");
		x.setAttribute("data-ref", json.thumbnails[i].id);
		x.style.display = "inline-block";
		x.style.marginRight = "2%";
		x.style.marginBottom = "1%";
		//create img element to hold image data
		var img = document.createElement("img");
		img.src = json.thumbnails[i].data;
		x.appendChild(img);
		/*var w = img.width; //using canvas instead of img, but we found img is easier to organize and more responsive
		var h = img.height;*/
		//create canvas element to hold img element
		/*var c = document.createElement("canvas");
		var ctx = c.getContext("2d");
		c.width = w;
		c.height = h;
		c.style.width = w + "px";
		c.style.height = h + "px";
		//draw img into canvas
		ctx.drawImage(img, 0, 0);*/
		//create a delete button for each img
		var btn = document.createElement("div");
		btn.style.background = "#FFC191";
		btn.style.boxshadow = "10px 10px 5px #888888";
		btn.setAttribute("class", "deleteBtn");
		btn.style.width = "100%";
		var p = document.createElement("p");
		var txt = document.createTextNode("Delete");
		p.appendChild(txt);
		p.style.textAlign = "center";
		btn.appendChild(p);
		//append both canvas and delete btn into the div
		//x.appendChild(c);
		x.appendChild(btn);
		//append the div into the listview container
		div.appendChild(x);
	}
	document.getElementById("cameraPage").style.display = "none";
	document.getElementById("listPage").style.display = "block";
	document.querySelector("[data-role=modal]").style.display = "none";
	document.querySelector("[data-role=overlay]").style.display = "none";
}

//ajax call for the full image
function fetchImg(ev){
	//console.log("wanna see this: "+ev.target.parentNode);
	var id = ev.target.parentNode.getAttribute("data-ref");
	var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/get.php?dev="+device.uuid+"&img_id="+id;
	sendRequest(url, imgReturned, null);
}
//return the full image after successful ajax call
function imgReturned(xhr){
	var json = JSON.parse(xhr.responseText);
	alert(json.id);
	
	var img = document.createElement("img");
	img.src = json.data;
	document.getElementById("pictureDiv").innerHTML="";
	document.getElementById("pictureDiv").appendChild(img);
	//canvas doesn't get loaded properly, so I am switching to just img 
	/*var w = img.width;
	var h = img.height;
	//load the image into the canvas
	var c = document.getElementById("c");
	var ctx = c.getContext("2d");
	c.width = w;
	c.height = h;
	c.style.width = w + "px";
	c.style.height = h + "px";
	//draw the image on canvas and show the modal and overlay
	ctx.drawImage(img, 0, 0);*/
	document.querySelector("[data-role=modal]").style.display = "block";
	document.querySelector("[data-role=overlay]").style.display = "block";
}
//close the modal after clicking the back button
function closeModalPage(){
	document.getElementById("cameraPage").style.display = "none";
	document.getElementById("listPage").style.display = "block";
	document.querySelector("[data-role=modal]").style.display = "none";
	document.querySelector("[data-role=overlay]").style.display = "none";
}

function deletePhotos(ev){
	//alert("delete btn triggered!");
	//console.log("$$$$$"+ev.target.parentNode.parentNode.getAttribute("data-ref"));
	var id = ev.target.parentNode.parentNode.getAttribute("data-ref");
	var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/delete.php?dev="+device.uuid+"&img_id="+id;
	sendRequest(url, imgDeleted, null);
}

function imgDeleted(xhr){
	var json = JSON.parse(xhr.responseText);
	alert(json.message);
	displayThumbnails();	
}