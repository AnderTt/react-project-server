module.exports = function (server) {
  // 得到IO对象(管理对象，管理与服务器建立连接的客服端)
  const io = require('socket.io')(server);
  // 监视连接(当有一个客户端连接上时，触发回调)
  io.on('connection', function (socket) {
    console.log('soketio connected');
    // 绑定sendMsg监听, 接收客户端发送的消息
    socket.on('sendMsg', function (data) {
      //data为客服端发给服务器的消息，当服务器收到客服端发来消息时，触发回调函数
      console.log('服务器接收到浏览器的消息', data);
      // 向客户端发送消息(名称, 数据)
      io.emit('receiveMsg', data.name + '_' + data.date);
      console.log('服务器向浏览器发送消息',  data.name + '_' + data.date)
    })
  })
};