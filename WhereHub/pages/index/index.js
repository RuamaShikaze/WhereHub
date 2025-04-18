// pages/navigation/navigation.js
Page({
  data: {
    floorMap: {
      image: '../../assets/maps/f1.png',
      width: 800,  // 图片实际像素宽度
      height: 600,
      scale: 0.5    // 1像素=0.5厘米
    },
    path: {
      nodes: [],
      pixels: []    // [[x1,y1], [x2,y2]...]
    }
  },

  // 加载地图数据
  loadFloorMap(floorId) {
    wx.request({
      url: `https://10.122.241.21:3000/api/floors/${floorId}`,
      success: ({ data }) => {
        this.setData({
          'floorMap.image': data.imageUrl,
          'floorMap.scale': data.scale,
          pois: data.pois
        });
      }
    });
  },

  // 计算路径
  calculatePath() {
    wx.request({
      url: 'https://10.122.241.21:3000/api/path/pathfinding',
      method: 'POST',
      data: {
        start: 'A101',
        end: 'B203',
        floor_id: 1
      },
      success: ({ data }) => {
        this.setData({
          'path.nodes': data.path,
          'path.pixels': data.coordinates
        });
        this.drawPath();
      }
    });
  },

  // 在canvas上绘制路径
  drawPath() {
    const ctx = wx.createCanvasContext('mapCanvas');
    const pixels = this.data.path.pixels;

    ctx.setStrokeStyle('#FF0000');
    ctx.setLineWidth(4);
    ctx.beginPath();
    ctx.moveTo(pixels[0][0], pixels[0][1]);
    
    for (let i = 1; i < pixels.length; i++) {
      ctx.lineTo(pixels[i][0], pixels[i][1]);
    }

    ctx.stroke();
    ctx.draw();
  }
});