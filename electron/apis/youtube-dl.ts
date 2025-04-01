import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import ffmpeg from '../singelton/ffmpeg';
import path from 'node:path';
import { ProgressCallback } from '../../sharedtypes';


export async function getInfo(url: string) {
    const info = await ytdl.getBasicInfo(url);
    return info;
}

export function download(url: string, progressCallback: ProgressCallback): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const info = await ytdl.getInfo(url);
            const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
            const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
            
            const outputDir = './downloads';
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }
            
            const videoPath = path.join(outputDir, 'video.mp4');
            const audioPath = path.join(outputDir, 'audio.mp4');
            const finalPath = path.join(outputDir, 'final.mp4');
            
            const videoStream = ytdl(url, { format: videoFormat });
            const audioStream = ytdl(url, { format: audioFormat });
            
            let downloadedBytes = 0;
            let totalBytes = parseInt(videoFormat.contentLength || '0') + parseInt(audioFormat.contentLength || '0');
            
            let videoDownloaded = false;
            let audioDownloaded = false;
            
            videoStream.pipe(fs.createWriteStream(videoPath));
            audioStream.pipe(fs.createWriteStream(audioPath));
            
            videoStream.on('progress', (chunk, downloaded) => {
                downloadedBytes += chunk;
                const progress = Math.round((downloadedBytes / totalBytes) * 100); // Round to full number
                progressCallback('video',progress); // Report full percentage
            });

            audioStream.on('progress', (chunk, downloaded) => {
                downloadedBytes += chunk;
                const progress = Math.round((downloadedBytes / totalBytes) * 100); // Round to full number
                progressCallback('audio', progress); // Report full percentage
            });

            videoStream.on('end', () => {
                videoDownloaded = true;
                if (audioDownloaded) {
                    progressCallback('video',100); // Full progress when both streams are downloaded
                }
            });

            audioStream.on('end', () => {
                audioDownloaded = true;
                if (videoDownloaded) {
                    progressCallback('audio', 100); // Full progress when both streams are downloaded
                }
            });
            
            audioStream.on('end', () => {
                ffmpeg()
                    .input(videoPath)
                    .input(audioPath)
                    .outputOptions(['-c:v copy', '-c:a aac'])
                    .save(finalPath)
                    .on('end', () => {
                        fs.unlinkSync(videoPath);
                        fs.unlinkSync(audioPath);
                        resolve(finalPath);
                    })
                    .on('error', reject);
            });
        } catch (error) {
            reject(error);
        }
    });
}
