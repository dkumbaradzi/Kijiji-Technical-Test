var data = [];
var container = document.getElementById('contentwrap');

/**
Random Number generator used to generate width and height
parameters for each listing within a predetermined range
**/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
	Generate listings
**/
for (var i = 0; i < 150; i++) {
	var obj = {};
	obj.title = "Title " + i;
	obj.width = getRandomInt(50,150);
	obj.height = getRandomInt(50,150);
	obj.area = obj.width * obj.height;
	obj.image = 'http://lorempixel.com/' + obj.width + '/' + obj.height;
	data.push(obj);
 } 
	
	 

function arrangeListings (listings) {
	
	/**
		Sort listings from largest to smallest
	**/
	listings.sort(
		function(a,b) {
			return parseFloat(b.area) - parseFloat(a.area);
		}
		);

	/**
		Initiate Packer function
	**/
	var packer = new Packer(800,800);
	packer.fit(listings);

	console.log(listings);

	renderListings(listings);

}

function renderListings(listings) {

	for (var i = 0; i < listings.length; i++) {
		
		 if (listings[i].fit) {
		 	var style = 'position:absolute;'
		 	style += ' top:' + listings[i].fit.y + 'px;';
		 	style += ' left:' + listings[i].fit.x + 'px;';
		 	style += ' width:' + listings[i].width + 'px;';
		 	style += ' height:'+ listings[i].height + 'px;';
		 	style += ' background-image: url(' + listings[i].image + ');';	 	
	 	
		 	var listing = '<div style="' + style + '">';
		 	listing += '<h4>' + listings[i].title + '</h4>';
		 	listing += '</div>';

		 	container.innerHTML += listing;
		 } else {
		 	/**
				Logs all listings that did not fit
		 	**/
		 	console.log(listings[i]);
		 }

	}
}

/**
	Binary tree bin packing algorithm
	https://github.com/jakesgordon/bin-packing/

	Starts with the addition of the largest element after which
	the remaining unpopulated area is divided into two rectangles,
	one right and one down from the element. This is recursively done
	until the binary tree is created. All elements that fit are assigned
	a fit attribute which is an object containing the width and height of
	the area it fits in, the element's x and y coordinates and down and right attributes
	that contain the dimensions of the areas right and down from the element
**/

/**
	Init function: Accepts the width and height of the container
	as arguments, with x and y coordinates that	correspond to 
	top and left offset values which default to 0 for the container
**/
Packer = function(width, height) {
  this.root = { x: 0, y: 0, width: width, height: height };
};

Packer.prototype = {

  /**
	Loops through each listing to check if there is enough space
	to fit it. If yes, it assigns a fit attribute to that listing
  **/
  fit: function(blocks) {
    var n, node, block;
    for (n = 0; n < blocks.length; n++) {
      block = blocks[n];
      if (node = this.findNode(this.root, block.width, block.height))
        block.fit = this.splitNode(node, block.width, block.height);
    }
  },

  /**
	Looks for unpopulated space to fit the element,
	if none available, returns null
  **/
  findNode: function(root, width, height) {
    if (root.used)
      return this.findNode(root.right, width, height) || this.findNode(root.down, width, height);
    else if ((width <= root.width) && (height <= root.height))
      return root;
    else
      return null;
  },
  /**
	Splits remaining unpopulated area into down and right segments,
	calculates width,height, top offset and left offset for each segment
  **/
  splitNode: function(node, width, height) {
    node.used = true;
    node.down  = { x: node.x,     y: node.y + height, width: node.width,     height: node.height - height };
    node.right = { x: node.x + width, y: node.y,     width: node.width - width, height: height};
    return node;
  }

}

arrangeListings(data);	
 

