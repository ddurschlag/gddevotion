var SavedBuilds = {};
function InitializeBuilds()
{
	var stored = localStorage.getItem("builds");
	if ( stored )
		SavedBuilds = JSON.parse(stored);
	else
		SavedBuilds = {};
}

function GetAllBuilds()
{
	var bs = [];
	for ( var b in SavedBuilds )
		bs.push(b);
	return bs;
}

function LoadBuild(n)
{
	var b = SavedBuilds[n];
	included = {};
	for ( var k in b.included )
		included[k] = b.included[k];
}

function SaveBuild(n)
{
	var b = { included:{} };
	for ( var k in included )
		b.included[k] = included[k];
	SavedBuilds[n] = b;
	localStorage.setItem("builds", JSON.stringify(SavedBuilds));
}

var included = {};

function Clear(n)
{
	while (n.childNodes.length > 0)
		n.removeChild(n.childNodes[0]);
}

function SetIncluded(constellation, value)
{
	included[constellation.Name] = value;
}

function GetIncluded(constellation)
{
	var cs = [];
	for ( var maybe in included )
	{
		if ( included[maybe] )
			cs.push(objByName[maybe]);
	}
	return cs;
}

function SwitchConf()
{
	var c = document.getElementById("conf");
	conf.className = conf.className == "confOpen" ? "confClose" : "confOpen";
}

function RenderGraph(els)
{

var cy = cytoscape({
  container: document.getElementById('cy'),
  
  boxSelectionEnabled: false,
  autounselectify: true,
  
  style: [
    {
      selector: 'node',
      css: {
        'content': 'data(first)',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': 3,
        'width':15,
        'height':15,
        'background-opacity':0.4,
        'background-color':'#0000aa',
        'color':'#ff0000'
      }
    },
    {
      selector: '$node > node',
      css: {
        'text-valign': 'top',
        'text-halign': 'center',
        'background-color': '#bbb'
      }
    },
    {
      selector: 'edge',
      css: {
        'target-arrow-shape': 'triangle',
	'label': 'data(added)',
	'font-size': 3,
	'edge-text-rotation': 'autorotate',
	'curve-style': 'unbundled-bezier',
	'control-point-distances': '-15 -15',
	'control-point-weights': '0.1 0.9',
	'line-color':'#b0b000',
	'target-arrow-color':'#b0b000'
      }
    },
    {
      selector: ':selected',
      css: {
        'background-color': 'black',
        'line-color': 'black',
        'target-arrow-color': 'black',
        'source-arrow-color': 'black'
      }
    }
  ],
  
  elements: els,
  
  layout: {

  name: 'grid',

  fit: true, // whether to fit the viewport to the graph
  padding: 30, // padding used on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  avoidOverlapPadding: 50, // extra spacing around nodes when avoidOverlap: true
  condense: true, // uses all available space on false, uses minimal space on true
  rows: undefined, // force num of rows in the grid
  cols: 50, // force num of columns in the grid
  position: function( node ){return {col:50-node.data().pointsLeft, row:node.data().index};}, // returns { row, col } for element
  sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  ready: undefined, // callback on layoutready
  stop: undefined // callback on layoutstop
  }
});

var template = $('#template').html();
Mustache.parse(template);

var partials = {};
$("script").filter(function() { return this.id.startsWith("template-"); }).each(function(){partials[this.id.substring(9)] = this.innerHTML;});

for ( var p in partials )
	Mustache.parse(partials[p]);

for ( var nIndex = 0 ; nIndex < els.nodes.length ; nIndex++ )
{
	var n = els.nodes[nIndex];
	cy.$("#" + n.data.id).qtip({
		content: Mustache.render(template, n.data, partials),
		style: {
			classes: 'qtip-bootstrap'
		}
	});
}

}