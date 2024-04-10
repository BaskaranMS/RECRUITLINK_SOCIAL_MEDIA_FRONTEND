import React from 'react'
import Topbar from '../../component/topbar/Topbar'
import Sidebar from '../../component/sidebar/Sidebar'
import Feed from '../../component/feed/Feed'
import Rightbar from '../../component/rightbar/Rightbar'
import './home.css'

function Home() {
  return (
    <div>
        <Topbar></Topbar>
        <div className="homeContainer">
            <Sidebar></Sidebar>
            <Feed home={true}></Feed>
            <Rightbar></Rightbar>
        </div>
    </div>
  )
}

export default Home