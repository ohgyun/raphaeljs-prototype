(function () {
  
  // Point
  var Point = function (x, y) {
    this.DIFF_RATIO = 10;
    this.x = x;
    this.y = y;
  };
  Point.prototype.getUpY = function(idx) {
    return this.y - (idx * this.DIFF_RATIO);
  };
  Point.prototype.getDownY = function(idx) {
    return this.y + (idx * this.DIFF_RATIO);
  };

  // Group of point
  var Points = function () {
    this._points = [];
  };
  Points.prototype.add = function(point) {
    this._points.push(point);
  };
  Points.prototype.each = function(callback) {
    var len = this._points.length;
    for (var i = 0; i < len; i++) {
      var p = this._points[i];
      callback.call(p, p, i, i === 0, i === len-1);
    }
  };
  Points.prototype.backEach = function(callback) {
    var len = this._points.length;
    for (var i = len-1; i >= 0; i--) {
      var p = this._points[i];
      callback.call(p, p, i, i === 0, i === len-1);
    } 
  };
  
  
  // Main
  var d = $(document),
    dw = d.width(),
    dh = d.height(),
    paper = Raphael(0, 0, dw, dh),
    CURVE_COUNT = 10,
    circles = paper.set();
  
  for (var i = 0; i < CURVE_COUNT; i++) {
    (function (idx) {
      setTimeout(function () {
        drawRandomCurvesAndCircles();  
      }, 500*idx);
    }(i));
    
    moveCirclesToFront();
  }
  drawMask();
  
  
  // Methods
  function drawRandomCurvesAndCircles() {
    var points = createRandomPoints(),
      color = createRandomColor();
      
    drawCurve(points, color);
    drawCircle(points, color);
  }
  
  function createRandomPoints() {
    var POINT_LEN = 4,
      PADDING = 200,
      w = dw - PADDING,
      h = dh - PADDING,
      points = new Points();
      
    for (var i = 0; i <= POINT_LEN; i++) {
      var x = parseInt(w / POINT_LEN) * i + PADDING/2,
        y = random() % h + PADDING/2;

      points.add(new Point(x, y));
    }
    
    return points;
  }  
  
  function random() {
    return parseInt(Math.random() * (1 << 30)); 
  }  
  
  function createRandomColor() {
    return random().toString(16).replace(/.*(\w{3})/, '#$1');
  } 
    
  function drawCurve(points, color) {
    var pathstr = [];
    
    points.each(function (p, i, isFirst, isLast) {
      if (isFirst) {
        pathstr.push('M', p.x, p.getUpY(i), 'R'); 
      } else {
        pathstr.push(p.x, p.getUpY(i)); 
      }
    });
    
    points.backEach(function (p, i, isFirst, isLast) {
      if (isLast) {
        pathstr.push('L', p.x, p.getDownY(i), 'R'); 
      } else {
        pathstr.push(p.x, p.getDownY(i));
      }
    });
    
    var path = paper.path(pathstr)
        .attr({
          'stroke': 'none',
          'fill': color,
          'opacity': 0
        })
        .toBack()
        .animate({
          'opacity': 0.5
        }, 3000);
  }  
  
  function drawCircle(points, color) {
    var RADIUS = 4;
    
    points.each(function (point, i) {
      var circle = paper.circle(point.x, point.y, 0);
      circle
          .attr({
            'stroke': '#333',
            'stroke-width': 1,
            'stroke-opacity': 0.2,
            'fill': color,
            'opacity': 0
          })
          .hover(function () {
            this.attr({ 'r': 20 });
          }, function () {
            this.attr({ 'r': 3 });
          }, circle, circle);
      
      circles.push(circle);
      
      setTimeout(function () {
        circle.animate({
          'opacity': 0.5,
          'r': RADIUS
        }, 1200, 'elastic')
      }, i*500);
    });  
  }
  
  function moveCirclesToFront() {
    circles.toFront();
  }
  
  function drawMask() {
    var MARGIN_LEFT = 200;
    
    paper
        .rect(-MARGIN_LEFT, 0, dw+MARGIN_LEFT, dh)
        .attr({
          'stroke': 'none',
          'fill': '180-#fff:80-#fff',
          'opacity': 0
        })
        .animate({
          'transform': 'T' + (dw-MARGIN_LEFT) + ',0'
        }, 8000, 'ease-in');
  }

}());
