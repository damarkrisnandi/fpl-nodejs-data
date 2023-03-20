import * as dotenv from 'dotenv'
dotenv.config()
import { fetchEntry, fetchEntryEvent } from 'fpl-api'
import { fetchBootstrap } from 'fpl-api'
import dataframeBuilder from './dataframe-builder.js';


const bootstrap = await fetchBootstrap()
const players = bootstrap.elements;
const evts = bootstrap.events;

const teamId = process.env.TEAM_ID
const gameweek = evts.filter(evt => new Date() <= new Date(evt.deadline_time))[0].id - 1;
const entry = await fetchEntry(teamId);
const data = await fetchEntryEvent(teamId, gameweek)

const position = (id) => {
    // element_type
    let pos = '';
    switch (id) {
        case 1:
            pos = 'GK'
            break;
        case 2:
            pos = 'DF'
            break;    
        case 3:
            pos = 'MF'
            break;
        case 4:
            pos = 'FW'
            break;
        default:
            break;
    }
    return pos;
}

const picks = data.picks.map(({
    element,
    multiplier,
    is_captain,
    is_vice_captain
}) => {
    const p = players.find(data => data.id === element)
    return {
        player: `${p.web_name} ${is_captain ? '(C)' : (is_vice_captain ? '(V)' : '')}`,
        position: position(p.element_type),
        points: p.event_points,
        total: p.event_points * multiplier
    }
})

let total_points = 0;
picks.forEach(({total}) => {
    total_points += total;
})

// const last_row = {total: total_points};
// picks.push(last_row);

// console.table(picks);
dataframeBuilder(picks, `${entry.player_first_name} ${entry.player_last_name}\n${entry.name}\nGameweek ${gameweek}\nTotal: ${total_points} pts`)

const starters = picks.slice(1,11);
let defender = [];
const df = starters.filter(o =>o.position === 'DF').map(d => d.player);
switch (df.length) {
    case 3:
        defender = [ ...df];
        defender.splice(0, 0, '')
        defender.push('')
        break;
    case 4:
        defender = [ ...df];
        defender.splice(2, 0, '')
        break;
    case 5:
        defender = [ ...df];
        break;
    default:
        break;
}

let midfielder = [];
const mf = starters.filter(o =>o.position === 'MF').map(d => d.player);
switch (mf.length) {
    case 2:
        midfielder = [ ...mf];
        midfielder.splice(1, 0, '')
        midfielder.splice(0, 0, '')
        midfielder.push('')
        break;
    case 3:
        midfielder = [ ...mf];
        midfielder.splice(0, 0, '')
        midfielder.push('')
        break;
    case 4:
        midfielder = [ ...mf];
        midfielder.splice(2, 0, '')
        break;
    case 5:
        midfielder = [ ...mf];
        break;
    default:
        break;
}

let forward = [];
const fw = starters.filter(o =>o.position === 'FW').map(d => d.player);
switch (fw.length) {
    case 1:
        forward = ['', '', fw[0], '', ''];
        break;
    case 2:
        forward = [ ...fw];
        forward.splice(1, 0, '')
        forward.splice(0, 0, '')
        forward.push('')
        break;
    case 3:
        forward = [ ...fw];
        forward.splice(0, 0, '')
        forward.push('')
        break;
    default:
        break;
}
let formation = [
    ['' , '', picks[0].player, '', ''],
    defender,
    midfielder,
    forward,
]

let bench = [
    picks.slice(11, 15).map(d => d.player)
]

dataframeBuilder(formation, 'Formation', [
    { alignment: 'center', width: 15 },
    { alignment: 'center', width: 15 },
    { alignment: 'center', width: 15 },
    { alignment: 'center', width: 15 },
],)

dataframeBuilder(bench, 'Bench', [
    { alignment: 'center', width: 15 },
    { alignment: 'center', width: 15 },
    { alignment: 'center', width: 15 },
    { alignment: 'center', width: 15 },
],)