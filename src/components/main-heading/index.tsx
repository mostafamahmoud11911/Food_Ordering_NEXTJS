import React from 'react'

export default function MainHeading({ title, subTitle }: { title: string | undefined; subTitle: string| undefined }) {
  return (
    <>
    <span className='uppercase text-accent font-semibold leading-4'>
      {subTitle}
    </span>
    <h2 className='text-primary font-bold text-4xl italic'>{title}</h2>
  </>
  )
}
