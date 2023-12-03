import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface GoBackProps {
    url: string
}

export const GoBack: React.FC<GoBackProps> = ({url}) => {
  return (
    <div className='mt-10'>
        <Link to={url} className='flex items-center gap-x-3 font-manrope tracking-tight'><FaArrowLeft className="text-sm font-extralight"/> Go back</Link>
    </div>
  )
}
