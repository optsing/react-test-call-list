import PlaySVG from '../assets/play.svg?react'
import PauseSVG from '../assets/pause.svg?react'
import DownloadSVG from '../assets/download.svg?react'
import CloseSVG from '../assets/close.svg?react'


import exampleSrc from '../assets/example.mp3'

import { durationTimeSecondsToMinutes } from '../helpers'
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'


const SAMPLE_DURATION = 58

function AudioPlayer({ duration, onClose }: { record: string, partnershipId: string, duration: number, onClose: () => void }) {
    duration = SAMPLE_DURATION

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play()
        } else{
            audioRef.current?.pause()
        }
    }, [isPlaying])

    function handlePlay(e: MouseEvent<HTMLElement>) {
        e.stopPropagation()
        setIsPlaying(!isPlaying)
    }

    async function handleDownload(e: MouseEvent<HTMLElement>) {
        e.stopPropagation()
        // const controller = new AbortController()
        // const signal = controller.signal
        try {
            // const blob = await getRecordBlob(record, partnershipId, signal)
            // const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = exampleSrc
            link.download = 'download'
            link.click()
            // URL.revokeObjectURL(link.href)
        } catch (err) {
            console.error(err)
        }
    }

    function handleClose(e: MouseEvent<HTMLElement>) {
        e.stopPropagation()
        onClose()
    }

    function handleTimeUpdate() {
        if (audioRef.current !== null) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    function handleProgressChange(e: ChangeEvent<HTMLInputElement>) {
        if (audioRef.current !== null) {
            const newTime = Number(e.currentTarget.value)
            audioRef.current.currentTime = newTime
            setCurrentTime(newTime)
        }
    }

    return (
        <div className='w-full h-12 rounded-full bg-[#EAF0FA] items-center px-3 gap-2 cursor-default flex'>
            <div className='mx-2 w-10'>{durationTimeSecondsToMinutes(currentTime | 0)}</div>
            <button role='button' onClick={handlePlay} className='w-6 h-6 text-[#002CFB] bg-[#FFFFFF] rounded-full flex items-center justify-center cursor-pointer'>
                { isPlaying ? <PauseSVG/> : <PlaySVG/> }
            </button>
            <input type='range' className='grow' min='0' max={duration} value={currentTime} onChange={handleProgressChange} />
            <button role='button' onClick={handleDownload} className='text-[#ADBFDF] hover:text-[#002CFB] cursor-pointer mx-2'>
                <DownloadSVG />
            </button>
            <button role='button' onClick={handleClose} className='text-[#ADBFDF] hover:text-[#002CFB] cursor-pointer mx-2'>
                <CloseSVG />
            </button>
            <audio
                ref={audioRef}
                src={exampleSrc}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)} />
        </div>
    )
}

export default AudioPlayer
