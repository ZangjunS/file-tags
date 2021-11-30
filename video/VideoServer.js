'use strict';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const http = require('http');

function getParam(url, key) {
    var param = new Object();
    var item = new Array();
    var urlList = url.split("?");
    var req;
    if (urlList.length == 1) {
        req = urlList[0];
    } else {
        req = urlList[1];
    }
    var list = req.split('&');
    for (var i = 0; i < list.length; i++) {
        item = list[i].split('=');
        param[item[0]] = item[1];
    }
    return param[key] ? param[key] : null;
}

class VideoServer {

    constructor(props) {
        this._videoServer;
        this._videoSourceInfo;
        this._ffmpegCommand;
    }

    set videoSourceInfo(info) {
        this._videoSourceInfo = info;
    }

    get videoSourceInfo() {
        return this._videoSourceInfo;
    }

    killFfmpegCommand() {
        if (this._ffmpegCommand) {
            this._ffmpegCommand.kill();
            this._ffmpegCommand = null;
        }
    }

    createServer(streamPort) {
        this._videoServer = http.createServer((request, response) => {
            console.log("on request", request.url);
            var startTime = parseInt(getParam(request.url, "startTime") - 0);
            var file = decodeURIComponent(getParam(request.url, "vPath"));
            let videoCodec = "h264_qsv";
            // let videoCodec = 'libx264';
            let audioCodec = 'aac';
            this.killFfmpegCommand();
            this._ffmpegCommand = ffmpeg()
                // .input(this.videoSourceInfo.videoSourcePath)
                .input(file)
                .nativeFramerate()
                // .size("10%")
                // .fps(30)
                // .frames(600)
                // .videoBitrate('1024k')
                .videoCodec(videoCodec)
                .audioCodec(audioCodec)
                .format('mp4')
                .seekInput(startTime)
                .outputOptions(
                    "-hwaccel", "qsv","-noautorotate"
                    // '-movflags', 'frag_keyframe+empty_moov+faststart',
                    // '-g', '18',
                    // "-threads", "3",
                    // "-preset", "ultrafast",
                    // "-profile", "Baseline",
                    // "-tune", "zerolatency "
                    )
                .on('progress', function (progress) {
                    console.log('time: ' + progress.timemark);
                })
                .on('error', function (err) {
                    console.log('An error occurred: ' + err.message);
                    var a = 1 / 0;
                })
                .on('end', function () {
                    console.log('Processing finished !');
                })
            this._ffmpegCommand.pipe(response);
        }).listen(streamPort);
    }
}
exports.VideoServer = VideoServer