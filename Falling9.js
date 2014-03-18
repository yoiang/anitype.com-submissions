/**
 * Register your submission and choose a character
 * For more information check out the documentation
 * http://anitype.com/documentation
 */
Anitype.register('9', {

  // Enter your name
  author: 'Ian G',

  // Enter a personal website, must have http
  website: 'https://github.com/yoiang',
  
  // Make your animation here
  construct: function(two, points) {

    // Reference to instance
    var anitype = this;

    var startingY = -1000;
    var firstAnimationBlock = 0.1;
    var polygon = anitype.makePolygon(points);
    polygon.translation.y = startingY;
    
    var setupOffset = function(vertex, offsetStart, offsetEnd) 
    {
      var offset = new Two.Vector(/*offsetEnd.x - offsetStart.x*/0, offsetEnd.y - offsetStart.y);
      vertex.nine_endPosition = new Two.Vector(vertex.x, vertex.y);
      vertex.subSelf(offset);
      vertex.nine_startPosition = new Two.Vector(vertex.x, vertex.y);
    };
    for(var index = 0; index < 3; index ++)
    {
      var vertex = points[index + 5];
      var match = points[index];

      setupOffset(vertex, match, vertex);
      setupOffset(vertex.controls.left, match.controls.left, vertex.controls.left);
      setupOffset(vertex.controls.right, match.controls.right, vertex.controls.right);
    }
    
    var updateOffset = function(vertex, percent)
    {
      vertex.x = vertex.nine_startPosition.x;
      vertex.y = vertex.nine_startPosition.y;
      vertex.lerp(vertex.nine_endPosition, percent);
    };
    var updateOffsetFull = function(vertex, percent)
    {
      updateOffset(vertex, percent);
      updateOffset(vertex.controls.left, percent);
      updateOffset(vertex.controls.right, percent);
    };
    var secondDelay = 0.0;
    var secondAnimationBlock = 0.1;
    anitype.addTick( function(percent)
    {
      if (percent <= firstAnimationBlock)
      {
        polygon.translation.y = startingY - startingY * (percent / firstAnimationBlock);
      } else
      {
        polygon.translation.y = 0;
        var adjustedPercent = percent - firstAnimationBlock;
        if (adjustedPercent <= secondDelay)
        {
        } else 
        {
          adjustedPercent -= secondDelay;
          if (adjustedPercent <= secondAnimationBlock)
          {
            for(var index = 0; index < 3; index ++)
            {
              var vertex = points[index + 5];
              var blockPercent = adjustedPercent / secondAnimationBlock;
              updateOffsetFull(vertex, blockPercent);
            }
          } else
          {
            var remainingTime = 1.0 - (firstAnimationBlock + secondDelay + secondAnimationBlock);
            for(index = 0; index < 3; index ++)
            {
              vertex = points[index + 5];
              var springOffset = (remainingTime - adjustedPercent) * Math.cos( adjustedPercent * Math.PI * 5 / remainingTime + Math.PI);
              updateOffsetFull(vertex, 1.0 + springOffset);
            }
          }
        }
      }
    } );
    return two.makeGroup(polygon);
  }

});