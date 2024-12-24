import React, { useEffect, useState } from 'react'
import useCustomMove from '../../hooks/useCustomMove'
import { getOne } from '../../api/infoApi'
import { Button } from 'react-bootstrap'

const initState = {
    id: 0,
    subject: "",
    content: "",
    createDate: null,
    modifyDate: null,
    author: ""
}

const InfoDetailComponent = ({id}) => {
  const [info, setInfo] = useState(initState)
  const {list, modify} = useCustomMove()

  useEffect(() => {
    getOne(id).then(data => {
        setInfo(data)
    })
  }, [id])
  
  return (
    <>
        <h2 className='fw-bold'>{info.subject}</h2>
        <div className='d-flex'>
            <p style={{color: 'grey'}}>{info.createDate}</p>
            <p className='ms-3'>{info.author.name}</p>
        </div>
        <div className='border rounded' style={{height: 500}}>
            <p className='p-3'>{info.content}</p>
        </div>
        <div className='text-end my-3'>
            <Button variant='primary' className='me-3' onClick={() => modify(id)}>수정</Button>
            <Button variant='secondary' onClick={() => list()}>목록보기</Button>
        </div>
    </>
  )
}

export default InfoDetailComponent