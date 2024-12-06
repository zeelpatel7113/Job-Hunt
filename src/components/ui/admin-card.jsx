import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './card'

const AdminCard = ({ icon, title, description, color }) => {
  return (
    <div>
        <Card className={`flex items-center w-64 ${color} h-24`}>
            <div className='ml-5 border-solid border-2 p-3 rounded-full bg-gray-950'>
                {icon}
            </div>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            
        </Card>
    </div>
  )
}

export default AdminCard