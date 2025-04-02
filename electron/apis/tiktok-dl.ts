import { net } from "electron";
import puppeteer from "puppeteer";
import fs from "fs";
import axios from 'axios';

const PLAYER_EMBED = "https://www.tiktok.com/player/v1/"

const INFO_API = "https://www.tiktok.com/oembed?url="

const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  };
  

export async function getInfoTiktok(url: string) {

    if (url.match(/(vm|vt)\.tiktok\.com\/(.*)/) || url.match(/(vm|vt|www)\.tiktok\.com\/t\/(.*)/)) {
        url = await getFullURL(url);
    }

    const response = await net.fetch(`${INFO_API}${url}`);

    if(!response.ok) {
        return null;
    }

    const data = await response.json();

    return {
        title: data.title,
        author_name: data.author_name,
        author_url: data.author_url,
        thumbnail_url: data.thumbnail_url
    }
}


export async function downloadTiktok(video: string, outputPath: string, callback: (progess: number) => void) {
    video = video.trim();
    const video_id = video.match(/^\d*$/) ? video : await detectVideoId(video);

    const embedUrl = `${PLAYER_EMBED}${video_id}`;
    const src = await getSrc(embedUrl);
    if(!src) {
        throw new Error('Video source not found');
    }

    await downloadFile(src, outputPath, callback);
}



async function getSrc(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const src = await page.evaluate(() => {
        const video = document.querySelector('video');
        return video?.getAttribute('src');
    });

    await browser.close();
    return src;
}




async function downloadFile(url: string, outputPath: string, callback: (progess: number) => void): Promise<void> {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        const totalSize = parseInt(response.headers['content-length'] || '0', 10);
        let downloadedSize = 0;
        callback(0);
        const writer = fs.createWriteStream(outputPath);

        response.data.on('data', (chunk: Buffer) => {
            downloadedSize += chunk.length;
            if (totalSize) {
                const progress = ((downloadedSize / totalSize) * 100)//.toFixed(2);
                callback(Math.round(progress));
            }
        });

        response.data.pipe(writer);

        await new Promise<void>((resolve, reject) => {
            writer.on('finish', () => {
                callback(100);
                resolve();
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

async function getFullURL(url: string): Promise<string>  {
    var match = url.match(/(vm|vt)\.tiktok\.com\/(.*)/);
    if (!match)
      match = url.match(/(www|vm|vt)\.tiktok\.com\/t\/(.*)/);
    if (!match)
      throw new Error(`Unknown TikTok video URL: ${url}`);
    // follow the redirect to get the full URL
    return new Promise((resolve, reject) => {
        axios.get(url, { headers }).then((res) => {
            if (res.request.res.responseUrl) {
                resolve(res.request.res.responseUrl);
            } else {
                reject('No redirect found');
            }
        }).catch(reject);
    });
};


function getVideoId (url: string): string {
    const regex = /\/video\/(\d*)/;
    const match = url.match(regex);
    if (match) return match[1];
    throw new Error(`Invalid TikTok video URL: ${url}`);
};


async function detectVideoId(url: string): Promise<string> {
    if (url.match(/(vm|vt)\.tiktok\.com\/(.*)/) || url.match(/(vm|vt|www)\.tiktok\.com\/t\/(.*)/)) {
      url = await getFullURL(url);
    }
    return getVideoId(url);
  };