import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import ffmpeg from '../singelton/ffmpeg';
import path from 'node:path';


export async function getInfoYoutube(url: string) {
    const info = await ytdl.getBasicInfo(url);
    return info;
}


export function downloadYoutube(
    url: string,
    filePath: string,
    progressCallback: (type: string, progress: number) => void
): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const info = await ytdl.getInfo(url);
            const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
            const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

            const filePathWithoutExt = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)));
            const videoPath = `${filePathWithoutExt}_video.mp4`;
            const audioPath = `${filePathWithoutExt}_audio.mp4`;

            let videoDownloaded = false;
            let audioDownloaded = false;

            const totalVideoSize = parseInt(videoFormat.contentLength || '0', 10);
            const totalAudioSize = parseInt(audioFormat.contentLength || '0', 10);

            let videoProgress = 0;
            let audioProgress = 0;

            const checkDownloadsComplete = () => {
                if (videoDownloaded && audioDownloaded) {
                    // console.log('Both downloads complete. Starting merging process...');
                    progressCallback('merge', 1);
                    ffmpeg()
                        .input(videoPath)
                        .input(audioPath)
                        .outputOptions(['-c:v copy', '-c:a aac'])
                        .save(filePath)
                        .on('progress', (progress) => {
                            // console.log('Merging progress:', progress.percent);
                            progressCallback('merge', Math.round(progress.percent || 0));
                        })
                        .on('end', () => {
                            fs.unlinkSync(videoPath);
                            fs.unlinkSync(audioPath);
                            console.log('Download and merge complete.');
                            resolve(filePath);
                        })
                        .on('error', reject);
                }
            };

            // Download video with progress tracking
            const videoStream = ytdl(url, { format: videoFormat });
            const videoWriteStream = fs.createWriteStream(videoPath);

            videoStream.pipe(videoWriteStream);

            videoStream.on('progress', (_, downloaded, _total) => {
                videoProgress = Math.round((downloaded / totalVideoSize) * 100);
                progressCallback('video', videoProgress);
            });

            videoWriteStream.on('finish', () => {
                videoDownloaded = true;
                progressCallback('video', 100);
                checkDownloadsComplete();
            });

            // Download audio with progress tracking
            const audioStream = ytdl(url, { format: audioFormat });
            const audioWriteStream = fs.createWriteStream(audioPath);

            audioStream.pipe(audioWriteStream);

            audioStream.on('progress', (_, downloaded, _total) => {
                audioProgress = Math.round((downloaded / totalAudioSize) * 100);
                progressCallback('audio', audioProgress);
            });

            audioWriteStream.on('finish', () => {
                audioDownloaded = true;
                progressCallback('audio', 100);
                checkDownloadsComplete();
            });

        } catch (error) {
            reject(error);
        }
    });
}