import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import CardSalles from '../components/CardSalles'

const Home = () => {
    return (
        <div className="home">
            <Hero />
            <CardSalles />
            <Features />
        </div>
    )
}

export default Home
