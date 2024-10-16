"use client"

import Footer from "scoremanager/components/shared/footer/page"
export default function Layout({ children }) {
    
    return (
        <main>
            <nav> Product navigation </nav>
            {children }
            <Footer/>
        </main>
    )
}