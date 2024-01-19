import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import axios from 'axios';
import "./UserCommunityRelationshipManager.css";

import "./CommunityLeaderboard.css"

type Ranking = {
    name: string;
    logo: string;
    position: number;
    totalUsers: number;
    totalExperience: number;
};

type CommunityLeaderboardProps = {
    lastUpdate: number;
};

const CommunityLeaderboard = (props: CommunityLeaderboardProps) => {
    const { data: rankings, isLoading: leaderboardLoading, refetch } = useQuery<Ranking[]>({
        queryKey: ['communities/leaderboard'],
        queryFn: () => axios.get('http://localhost:8080/community/leaderboard').then(res => res.data)
    });

    useEffect(() => {
        refetch()
    }, [props.lastUpdate]);

    if (leaderboardLoading) return 'Loading...';
    return (
        <div>
        <h2>Community Leaderboard</h2>
        <div className="community-leaderboard">
            {rankings?.map((rank, index) => (<div key={index} className="leaderboard-row">
                <div className="row-position">#{(index+1)}</div>
                <div className="row-logo"><img src={rank.logo}/></div>
                <div className="row-name">{rank.name}</div>
                <div className="row-total-experience">XP<br/>{rank.totalExperience}</div>
                <div className="row-total-users">Users<br/>{rank.totalUsers}</div>
            </div>))}
        </div>
        </div>
    );
};

export default CommunityLeaderboard;