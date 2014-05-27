var PageManager = (function(){
  var instance;
  
  function init() {
    var pageUrl;
    var coordinates = [];
    var frameId = "#frame";
    var panelIndex = 0;
    var pageCenter;
    var $frame;
    var frameCenter;
    var pageWidth;
    var pageHeight;
    var JAW_TOP = ".jaws.top";
    var JAW_BOTTOM = ".jaws.bottom";
    var JAW_RIGHT = ".jaws.right";
    var JAW_LEFT = ".jaws.left";
    
    function resetJaws() {
      $frame.find(JAW_TOP).css("height", "0");
      $frame.find(JAW_BOTTOM).css("height", "0");
      $frame.find(JAW_LEFT).css("width", "0");
      $frame.find(JAW_RIGHT).css("width", "0");
    }
    
    function renderPanel() {
      if (panelIndex < 0) panelIndex = 0;
      if (panelIndex >= coordinates.length) panelIndex = coordinates.length -1;
      
      var coord = coordinates[panelIndex];
      var coordArr = coord.split(",");
      
      //cleanup
      resetJaws();
  
      if (coordArr.length == 4) {
        var panelX1 = coordArr[0];
        var panelY1 = coordArr[1];
        var panelX2 = coordArr[2];
        var panelY2 = coordArr[3];
        var zoom = 1;
        var jawLength = 0;
        
        var originalPanelWith = panelX2 - panelX1;
        var originalPanelHeight = panelY2 - panelY1;

        if (originalPanelWith >= originalPanelHeight) {
          zoom = $frame.width() / (panelX2-panelX1);
        } else {
          zoom = $frame.height() / (originalPanelHeight);
        }

        var panelWidth = zoom * (panelX2-panelX1);
        var panelHeight = zoom * (panelY2-panelY1);

        // wider than higher        
        if (originalPanelWith >= originalPanelHeight) {
          jawLength = ($frame.height() - panelHeight) / 2;
          $frame.find(JAW_TOP).css("height", jawLength + "px");
          $frame.find(JAW_BOTTOM).css("height", jawLength + "px");
        } else {
          jawLength = ($frame.width() - panelWidth) / 2;
          $frame.find(JAW_LEFT).css("width", jawLength + "px");
          $frame.find(JAW_RIGHT).css("width", jawLength + "px");          
        }        
        
        // moving panel center to page center
        var moveX = frameCenter.x - (panelX1*zoom) - (panelWidth/2);
        var moveY = frameCenter.y - (panelY1*zoom) - (panelHeight/2);
        
        $frame.css("background-position", moveX + "px " + moveY + "px");
        $frame.css("background-size", (pageWidth*zoom) + "px", (pageHeight*zoom) + "px");
      } else {
        console.warn("Wrong number of coordinates!", coord);
      }
    };
    
    function renderPage() {
        // loads the page link (image)
        // and renders the first panel
        if (pageUrl && coordinates.length > 0) {
          var page = new Image();
          page.src = pageUrl;
          
          page.onload = function(e) {
            pageWidth = this.width;
            pageHeight = this.height;
            
            $frame = $(frameId);
            pageCenter = {
              x: pageWidth/2,
              y: pageHeight/2
            };
            
            if ($frame) {
              $frame.css("background-image", "url(" + pageUrl + ")");
              frameCenter = {
                x: $frame.width()/2,
                y: $frame.height()/2
              };
  
              renderPanel(coordinates[0]);
            } else {
              console.warn("Frame is not present in DOM!", $frame);
            }
          }
        } else {
          console.warn("Hmmm. Missing pageUrl or coordinates", pageUrl, coordinates);
        }              
    };
    
    return {
      setPage: function(url, coords) {
        pageUrl = url;
        coordinates = coords;
      },
      getPageUrl: function() {
        return pageUrl;
      },
      setPageUrl: function(url) {
        pageUrl = url;
      },
      getCoordinates: function() {
        return coordinates;
      },
      
      setCoordinates: function(newCords) {
        coordinates = newCords;
      },
      getFrameId: function(){
        return frameId;
      },
      setFrameId: function(newFrameId) {
        frameId = newFrameId;
      },
      renderPage: renderPage,
      nextPanel: function() {
        renderPanel(++panelIndex);
      },
      prevPanel: function() {
        renderPanel(--panelIndex);
      }
    }
  }
  
  return {
    getInstance: function () {
      if ( !instance ) instance = init();
      return instance;
    }
  };
})();