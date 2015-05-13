module.exports = function (file, options, cb) {
  cb(null, {
    buffer: new Buffer(file.buffer.toString().replace('reactList', 'ReactList'))
  });
};
