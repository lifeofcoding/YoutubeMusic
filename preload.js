// in preload scripts, we have access to node.js and electron APIs
// the remote web app will not, so this is safe
const { ipcRenderer: ipc, remote } = require('electron');

init();

function createFragment(htmlStr) {
  var frag = document.createDocumentFragment(),
      temp = document.createElement('div');

  temp.innerHTML = htmlStr;

  while(temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }

  return  frag;
}

function init() {
  // left blank for now
}

document.addEventListener("DOMNodeInserted", function (get_id_and_class) {
    var element_id = get_id_and_class.target.id;
    var element_class = get_id_and_class.target.className;

    if(element_class !='' && class_hashmap[element_class] !=undefined){
        hide_elements_class(element_class);
    }

    if(element_id !='' && id_hashmap[element_id] !=undefined){
        hide_elements_id(element_id);
    }
});


document.addEventListener("DOMSubtreeModified", function (get_id_and_class) {
    var element_id = get_id_and_class.target.id;
    var element_class = get_id_and_class.target.className;

    if(element_class !='' && class_hashmap[element_class] !=undefined){
        hide_elements_class(element_class);
    }

    if(element_id !='' && id_hashmap[element_id] !=undefined){
        hide_elements_id(element_id);
    }

});


function hide_elements_class(element_class) {
    if (element_class) {
        var appBanners = document.getElementsByClassName(element_class);
        [].forEach.call(appBanners, function (appBanner) {
            appBanner.style.display = 'none';
            console.log('hided the class' +element_class )
        });
    }
}



function hide_elements_id(element_id){
    document.getElementById(element_id).style.display = 'none';
    console.log('hided the id'  +element_id)
}

document.addEventListener("DOMContentLoaded", function () {
    var allElements = document.getElementsByTagName('*');
    for(var i = 0; i < allElements.length; i++) {

        if (allElements[i].id !='' && id_hashmap[allElements[i].id] != undefined) {
            hide_elements_id(allElements[i].id);
        }

        if (allElements[i].className !='' && class_hashmap[allElements[i].className] != undefined) {
            hide_elements_class(allElements[i].className);

        }
    }
});

var class_hashmap={'ad1':'ad1','ad2':'ad2'}
var id_hashmap = {'adid1':'adid1','adid2':adid2}

debugger;
document.addEventListener("DOMContentLoaded", function() {
  // code...
  alert('erfwef');
  console.warn('addijng download');
  document.querySelector('.middle-controls-buttons').prepend(createFragment(`
    <paper-icon-button class="download style-scope ytmusic-like-button-renderer" role="button" tabindex="0" aria-disabled="false" title="Download" aria-label="Download" aria-pressed="false">
      <iron-icon id="icon" class="style-scope paper-icon-button">
      <img src="data:image/png;base64,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" alt="" />
      </iron-icon>
    </paper-icon-button>
  `))
});
