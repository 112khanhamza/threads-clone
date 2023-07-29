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
    const [threadInstance, setThreadInstance] = useState(thread)
    const currentUserId = '64c53477c6c7921e078a'

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

    const toggleLike = async () => {
        console.log('Like Toggled')
        const usersWhoLiked = thread.users_who_liked

        if (usersWhoLiked.includes(currentUserId)) {
            const index = usersWhoLiked.indexOf(currentUserId)
            usersWhoLiked.splice(index, 1)
        } else {
            usersWhoLiked.push(currentUserId)
        }

        const payload = {
            'users_who_liked' : usersWhoLiked,
            'likes' : usersWhoLiked.length
        }

        const response = await database.updateDocument(
            DEV_DB_ID,
            COLLECTION_ID_THREADS,
            thread.$id,
            payload
        )

        setThreadInstance(response)

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
                <Heart 
                    className='cursor-pointer' 
                    size={22} 
                    onClick={toggleLike}
                    color={threadInstance.users_who_liked.includes(currentUserId) ? '#ff0000' : '#fff'}
                />
                <MessageCircle size={22} />
                <Repeat size={22} />
                <Send size={22} />
            </div>

            {/* Thread Likes & Comments */}
            <div className='flex gap-4'>
                <p className='text-[rgba(97,97,97,1)]'>Replies 16</p>
                <p className='text-[rgba(97,97,97,1)]'>·</p>
                <p className='text-[rgba(97,97,97,1)]'>{threadInstance.likes} Likes</p>
            </div>

        </div>
    </div>
  )
}

export default Thread