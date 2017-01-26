WAV files used as source.

Opus files encoded using the following:
`opusenc --bitrate 32 --framesize 60 --downmix-mono file.wav file.opus`

MP3 files encided using the following:
`ffmpeg -y -i file.wav -codec:a libmp3lame -qscale:a 8 -ac 1 file.mp3`
