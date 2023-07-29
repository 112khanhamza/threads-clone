import React, { useEffect, useState } from 'react'
import { Heart, Repeat, Send, MessageCircle, Trash2 } from 'react-feather'
import { functions, database, DEV_DB_ID, COLLECTION_ID_THREADS } from '../appwriteConfig'
import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const Thread = ({ thread, setThread }) => {
    const [loading, setLoading] = useState(true)
    const [owner, setOwner] = useState(null)

    useEffect(() => {
        // get owner info
        getUserInfo()
    }, [])

    const getUserInfo = async () => {
        const payload = {
            'owner_id' : thread.owner_id
        }
        const response = await functions.createExecution(
            '64c55ff29d5b97f18069',
            JSON.stringify(payload)
            );
        const userData = JSON.parse(response.response)
        setOwner(userData)
        setLoading(false)
    }

    const handleDelete = async () => {
        setThread(prevState => prevState.filter(item => item.$id !== thread.$id))
        database.deleteDocument(DEV_DB_ID, COLLECTION_ID_THREADS, thread.$id)
        console.log('Thread was deleted')
    }

    if (loading) return

  return (
    <div className='flex p-4'>
        <img 
        className='w-10 h-10 rounded-full object-cover'
        src={owner.profile_pic} 
        />
        
        <div className='w-full px-2 pb-4 border-b border-[rgba(49, 49, 50, 1)]'>

            {/* Thead Header */}
            <div className='flex justify-between gap-2'>
                <strong>{owner.name}</strong>

                <div className='flex justify-between gap-2 items-center cursor-pointer'>
                <p className='text-[rgba(97,97,97,1)]'>
                    {<ReactTimeAgo date={new Date(thread.$createdAt).getTime()} locale="en-US"/>}
                </p>
                <Trash2 onClick={handleDelete} size={14}/>
                </div>
            </div>

            {/* Thread Body */}
            <div className='py-4' style={{ whiteSpace: 'pre-wrap' }}>
                {thread.body}
                {thread.image && (
                    <img className='object-cover border border-[rgba(49,49,50,1)] rounded-md' src={thread.image} />
                )}
            </div>

            {/* Thread Butttons */}
            <div className='flex gap-4 py-4'>
                <Heart size={22} />
                <MessageCircle size={22} />
                <Repeat size={22} />
                <Send size={22} />
            </div>

            {/* Thread Likes & Comments */}
            <div className='flex gap-4'>
                <p className='text-[rgba(97,97,97,1)]'>Replies 16</p>
                <p className='text-[rgba(97,97,97,1)]'>·</p>
                <p className='text-[rgba(97,97,97,1)]'>87 Likes</p>
            </div>

        </div>
    </div>
  )
}

export default Thread