import React, { useEffect, useRef, useState } from 'react'
import Thread from '../components/Thread'
import { database, storage, DEV_DB_ID, COLLECTION_ID_THREADS, BUCKET_ID_IMAGES } from '../appwriteConfig'
import { ID, Query } from 'appwrite'
import { Image } from 'react-feather'

const Feed = () => {

  const [threads, setThreads] = useState([])
  const [threadBody, setThreadBody] = useState('')
  const [threadImg, setThreadImg] = useState(null)

  const fileRef = useRef(null)

  useEffect(() => {
    getThreads()
  }, [])

  const getThreads = async () => {
    const response = await database.listDocuments(
      DEV_DB_ID, 
      COLLECTION_ID_THREADS,
      [
        Query.orderDesc('$createdAt')
      ]
      )
    setThreads(response.documents)
    console.log(response.documents)
  }

  const handleThreadSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      'owner_id' : '64c53477c6c7921e078a',
      'body' : threadBody,
      'image' : threadImg
    }
    const response = await database.createDocument(
      DEV_DB_ID,
      COLLECTION_ID_THREADS,
      ID.unique(),
      payload
    )
    console.log(response)
    setThreads(prevState => [response, ...prevState])
    setThreadBody('')
    setThreadImg(null)
  }

  const handleClick = async (e) => {
    fileRef.current.click()
  }

  const handleFileChange = async (e) => {
    const fileObj = e.target.files && e.target.files[0];
    console.log(fileObj)
    if (!fileObj) {
      return
    }

    const response = await storage.createFile(
      BUCKET_ID_IMAGES, 
      ID.unique(), 
      fileObj
    )

    const imagePreview = storage.getFilePreview(BUCKET_ID_IMAGES, response.$id);
    setThreadImg(imagePreview.href)

    console.log(imagePreview.href)

  }

  return (
    <div className='container mx-auto max-w-[600px]'>

      <div className='p-4'>
        <form onSubmit={handleThreadSubmit}>
          <textarea
          className='rounded-lg p-4 w-full bg=[rgba(29,29,29,1)]'
            required
            name='body'
            placeholder='Say something...'
            value={threadBody}
            onChange={(e) => {setThreadBody(e.target.value)}}
          >
          </textarea>

          <img src={threadImg} />

          <input 
            style={{ display: 'none' }}
            type='file' 
            ref={fileRef}
            onChange={handleFileChange}
          />
          <div className='flex justify-between items-center border-y border-[rgba(49,49,50,1)]'>
            <Image onClick={handleClick} className='cursor-pointer' size={24} />
            <input className="bg-white text-black py-2 px-4 border text-sm border-black rounded" type='submit' value='Post' />
          </div>
        </form>
      </div>

      {threads.map(thread => (
        <Thread key={thread.$id} thread={thread} setThread={setThreads} />
      ))}
    </div>
  )
}

export default Feed