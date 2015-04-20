var i, full, thumb, w, h, aspectRatio;

function imgSuccess(fileURI){
	full = document.getElementById("full");
	thumb = document.getElementById("thumb");
	i = document.createElement("img");
	i.addEventListener("load", setCanvas);
	i.src = fileURI;
	
	document.getElementById("saveBtn").addEventListener("click", upload);
}

function imgFail(message){
	 alert('Failed because: '+ message);
}

var imgOptions = {
	quality : 75,
	destinationType: Camera.DestinationType.FILE_URI,
	sourceType: Camera.PictureSourceType.CAMERA,
	allowEdit : true,
	encodingType : Camera.EncodingType.JPEG,
	mediaType: Camera.MediaType.PICTURE,
	targetWidth : 100,
	targetHeight : 100,
	cameraDirection : Camera.Direction.FRONT,
	saveToPhotoAlbum : false
}

function setCanvas(ev){
	//image has been loaded
	w = i.width;
	h = i.height;
	aspectRatio = w/h;
	//big image
	full.height = 400;
	full.style.height = "400px";
	var fw = 400 * aspectRatio;
	full.width = fw;
	full.style.width = fw + "px";
	i.width = fw;
	i.height = 400;
	var ctF = full.getContext('2d');
	ctF.drawImage(i, 0, 0, fw, 400);
	
	//thumbnail
	thumb.height = 200;
	thumb.style.height = "200px";
	var tw = 200 * aspectRatio;
	thumb.width = tw;
	thumb.style.width = tw + "px";
	i.width = tw;
	i.height = 200;
	var ctT = thumb.getContext('2d');
	ctT.drawImage(i, 0, 0, tw, 200);
	
}

function upload(ev){
	alert("img uploaded");
	var fullpng = full.toDataURL("image/png");
	var thumbpng = thumb.toDataURL("image/png");
	fullpng = encodeURIComponent( fullpng );
	thumbpng = encodeURIComponent( thumbpng );
	var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/save.php";
	var postData = "dev=234234&thumb=" + thumbpng + "&img=" + fullpng;
	sendRequest(url, imgSaved, postData);
}

function imgSaved(xhr){
	alert(xhr.responseText);
}


