import * as dotenv from 'dotenv'
dotenv.config()
import { fetchClassicLeague } from 'fpl-api'
import dataframeBuilder from './dataframe-builder.js';

const leagueId = process.env.LEAGUE_ID
const data = await fetchClassicLeague(leagueId);

const result = data.standings.results.map((
    {
        id, 
        player_name,
        entry_name, 
        event_total, 
        rank, 
        last_rank, 
        total
    }, index) => { 
        return {
            // id, 
            rank, 
            player_name,
            entry_name, 
            event_total, 
            last_rank, 
            delta_rank: `${rank < last_rank ? '\u2191' : (rank === last_rank ? '' : '\u2193')}${Math.abs(rank - last_rank)}`,
            total,
            gap: '+' + (index > 0 ? data.standings.results[0].total - data.standings.results[index].total : 0) 
        } })
    // uncomment this to sort by point gameweek 
    // result.sort((a,b) => b.event_total - a.event_total);

dataframeBuilder(result, data.league.name)