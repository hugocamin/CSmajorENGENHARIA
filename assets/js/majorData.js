// ===============================================================
// ARQUITETURA DE DADOS REFEITA
// Primeiro, uma lista central de todos os times para evitar repetição.
// ===============================================================

const majorTeams = {
    'faze': { name: 'FaZe Clan', logo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fnohat.cc%2Fs%2Ffaze-clan-logo-png&psig=AOvVaw3y2unrg-ubM9Lsoicj1dfH&ust=1750591843200000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKiPu_q0go4DFQAAAAAdAAAAABAE' },
    'spirit': { name: 'Team Spirit', logo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fliquipedia.net%2Fcounterstrike%2FTeam_Spirit&psig=AOvVaw1f9zeZsfR7SckHQHyX0lZV&ust=1750591881486000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNCHnI21go4DFQAAAAAdAAAAABAE' },
    'vitality': { name: 'Team Vitality', logo: 'https://i.imgur.com/4929V8S.png' },
    'mouz': { name: 'MOUZ', logo: 'https://upload.wikimedia.org/wikipedia/pt/7/7a/Mouz_logo.png' },
    'complexity': { name: 'Complexity', logo: 'https://i.imgur.com/C2S886c.png' },
    'vp': { name: 'Virtus.pro', logo: 'https://i.imgur.com/6d2fkGf.png' },
    'navi': { name: 'Natus Vincere', logo: 'https://i.imgur.com/gVRoP9G.png' },
    'g2': { name: 'G2 Esports', logo: 'https://i.imgur.com/sT4q3tK.png' },
    'eternalfire': { name: 'Eternal Fire', logo: 'https://upload.wikimedia.org/wikipedia/en/1/11/Eternal_fire_logo.png' },
    'pain': { name: 'paiN Gaming', logo: 'https://ggscore.com/media/logo/t11091.png?94' },
    'imperial': { name: 'Imperial Esports', logo: 'https://i.imgur.com/5AYnB2j.png' },
    'ecstatic': { name: 'ECSTATIC', logo: 'https://i.imgur.com/s8zC59a.png' },
    'heroic': { name: 'HEROIC', logo: 'https://i.imgur.com/V9nJ3T9.png' },
    'mongolz': { name: 'The Mongolz', logo: 'https://upload.wikimedia.org/wikipedia/ru/thumb/7/73/The_MongolZ_logo.png/960px-The_MongolZ_logo.png?20240829082339' },
    'cloud9': { name: 'Cloud9', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Cloud9_logo.svg' },
    'furia': { name: 'FURIA', logo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffavpng.com%2Fpng_view%2Fesport-counter-strike-global-offensive-furia-esports-electronic-sports-dota-2-esl-pro-league-season-7-png%2FXFcaMziA&psig=AOvVaw0lq2xdWbvnse_xbf3m8bzb&ust=1750764003348000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCl46W2h44DFQAAAAAdAAAAABAE' }
};

// ===============================================================
// Os dados do campeonato agora usam os IDs dos times, 
// tornando o arquivo mais limpo e fácil de gerenciar.
// ===============================================================

const majorData = {
    eliminationStage: {
        title: "Elimination Stage (Formato Suíço)",
        rounds: [
            {
                roundName: "Confrontos Iniciais (Exemplo)",
                matches: [
                    { team1: 'faze', team2: 'g2', score1: 1, score2: 0, status: "Concluído" },
                    { team1: 'spirit', team2: 'furia', score1: 1, score2: 0, status: "Concluído" },
                    { team1: 'navi', team2: 'mouz', score1: 0, score2: 1, status: "Concluído" },
                    { team1: 'vp', team2: 'imperial', score1: 1, score2: 0, status: "Concluído" },
                ]
            },
        ]
    },
    playoffs: {
        title: "Playoffs - Mata-mata",
        quarterFinals: [
            { id: 'qf1', team1: 'spirit', team2: 'faze', score1: 1, score2: 2, status: "Concluído" },
            { id: 'qf2', team1: 'vitality', team2: 'cloud9', score1: 2, score2: 0, status: "Concluído" },
            { id: 'qf3', team1: 'eternalfire', team2: 'navi', score1: 0, score2: 2, status: "Concluído" },
            { id: 'qf4', team1: 'mouz', team2: 'g2', score1: 0, score2: 2, status: "Concluído" }
        ],
        semiFinals: [
            { id: 'sf1', team1: null, team2: null, score1: 0, score2: 0, status: "Aguardando" },
            { id: 'sf2', team1: null, team2: null, score1: 0, score2: 0, status: "Aguardando" }
        ],
        finals: [
            { id: 'final', team1: null, team2: null, score1: 0, score2: 0, status: "Aguardando" }
        ]
    }
};