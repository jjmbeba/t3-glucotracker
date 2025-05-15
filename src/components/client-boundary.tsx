'use client'

import { type ReactNode } from 'react'

interface ClientBoundaryProps {
    children: ReactNode
}

const ClientBoundary = ({ children }: ClientBoundaryProps) => {
    return <>{children}</>
}

export default ClientBoundary