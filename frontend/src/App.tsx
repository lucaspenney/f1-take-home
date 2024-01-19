import './App.css'
import { useState } from 'react';
import UserCommunityRelationshipManager from './components/UserCommunityRelationshipManager'
import CommunityLeaderboard from './components/CommunityLeaderboard'
import { Toaster } from 'react-hot-toast';

function App() {

  const [lastUpdate, setLastUpdate] = useState<number>(0);

  return (
    <>
      <Toaster position="bottom-right"/>
      <div>
        <a href="https://frameonesoftware.com" target="_blank">
          <img src="/logo.png" className="logo" alt="Frame One Software Logo" />
        </a>
      </div>
      <div>
        <UserCommunityRelationshipManager setLastUpdate={setLastUpdate} />
        <CommunityLeaderboard lastUpdate={lastUpdate}/>
      </div>
    </>
  )
}

export default App