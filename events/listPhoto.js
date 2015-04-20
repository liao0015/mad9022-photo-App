


document.addEventListener("DOMContentLoaded", onDeviceReady, false);
//document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	//Hammer js tap handler
	addHammerTapHandler();
	//save photo
	init();
	//show take photo div
	var takePhoto = document.getElementById("takeBtn");
	takePhoto.addEventListener("click", function(){takePhotoPage();},false);
	//show list photo div
	var listPhoto = document.getElementById("listBtn");
	listPhoto.addEventListener("click", function(){displayThumbnails();});
	//close modal
	var closeModal = document.getElementById("backBtn");
	closeModal.addEventListener("click", function(){closeModalPage();});
	//delete photo
	var delPho = document.querySelectorAll("deleteBtn");
	for (var i = 0; i < delPho.length; i++){
		delPho[i].addEventListener("click", function(ev){deletePhotos(ev);});
	}
}

function addHammerTapHandler(){
	var tar = document.querySelector("[data-role=listview]");
	var mc = new Hammer (tar);
	
	mc.on("tap", function(ev){
		console.log(ev.target);
		/*console.log(ev.target.parentNode);
		console.log(ev.target.parentNode.childNodes);
		console.log(ev.target.parentNode.firstChild);
		console.log(ev.target.parentNode.secondChild);
		console.log(ev.target.parentNode.childNodes[1]);*/
		console.log(ev.target.nodeName);
		if(ev.target.nodeName == "CANVAS"){
			document.querySelector("[data-role=modal]").style.display = "block";
			document.querySelector("[data-role=overlay]").style.display = "block";
			fetchImg(ev);
		}
		else if(ev.target.nodeName == "P"){
			document.querySelector("[data-role=modal]").style.display = "none";
			document.querySelector("[data-role=overlay]").style.display = "none";
			deletePhotos(ev);
		}
	});
}

function takePhotoPage(ev){
	alert("take photo");
	document.getElementById("cameraPage").style.display = "block";
	document.getElementById("listPage").style.display = "none";
	document.querySelector("[data-role=modal]").style.display = "none";
	document.querySelector("[data-role=overlay]").style.display = "none";
	
}

function displayThumbnails(ev){
	//display listPhoto div
	document.getElementById("cameraPage").style.display = "none";
	document.getElementById("listPage").style.display = "block";
	document.querySelector("[data-role=modal]").style.display = "none";
	document.querySelector("[data-role=overlay]").style.display = "none";
	//ajax call to fetch in img data
	var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/list.php?dev=234234";
	sendRequest(url, thunmbnailReturned, null);
}

function thunmbnailReturned(xhr){
	var json = JSON.parse(xhr.responseText);
	alert("something");
	var div = document.querySelector("[data-role=listview]");
	div.innerHTML="";
	for (var i = 0; i < json.thumbnails.length; i++){
		//create a div container
		var x = document.createElement("div");
		x.setAttribute("data-ref", json.thumbnails[i].id);
		x.style.display = "inline-block";
		x.style.marginRight = "2%";
		//create img element to hold image data
		var img = document.createElement("img");
		img.src = json.thumbnails[i].data;
		var w = img.width;
		var h = img.height;
		//create canvas element to hold img element
		var c = document.createElement("canvas");
		var ctx = c.getContext("2d");
		c.width = w;
		c.height = h;
		c.style.width = w + "px";
		c.style.height = h + "px";
		//draw img into canvas
		ctx.drawImage(img, 0, 0);
		//create a delete button for each img
		var btn = document.createElement("div");
		btn.setAttribute("class", "deleteBtn");
		var p = document.createElement("p");
		p.innerHTML = "Delete";
		p.style.textAlign = "center";
		btn.appendChild(p);
		//append both canvas and delete btn into the div
		x.appendChild(c);
		x.appendChild(btn);
		//append the div into the listview container
		div.appendChild(x);
	}
}



function fetchImg(ev){
	//console.log("wanna see this: "+ev.target.parentNode);
	var id = ev.target.parentNode.getAttribute("data-ref");
	var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/get.php?dev=234234&img_id="+id;
	sendRequest(url, imgReturned, null);
}

function imgReturned(xhr){
	var json = JSON.parse(xhr.responseText);
	alert(json.id);
	var img = document.createElement("img");
	img.src = json.data;
	var w = img.width;
	var h = img.height;
	
	//now load the image into the canvas
	var c = document.getElementById("c");
	var ctx = c.getContext("2d");
	c.width = w;
	c.height = h;
	c.style.width = w + "px";
	c.style.height = h + "px";
	
	ctx.drawImage(img, 0, 0);
}

function closeModalPage(){
	document.getElementById("cameraPage").style.display = "none";
	document.getElementById("listPage").style.display = "block";
	document.querySelector("[data-role=modal]").style.display = "none";
	document.querySelector("[data-role=overlay]").style.display = "none";
}

function deletePhotos(ev){
	alert("delete btn triggered!");
	console.log("$$$$$"+ev.target.parentNode.parentNode.getAttribute("data-ref"));
	var id = ev.target.parentNode.parentNode.getAttribute("data-ref");
	var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/delete.php?dev=234234&img_id="+id;
	sendRequest(url, imgDeleted, null);
}

function imgDeleted(xhr){
	var json = JSON.parse(xhr.responseText);
	alert(json.message);
	displayThumbnails();	
}