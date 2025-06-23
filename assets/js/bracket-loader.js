// assets/js/bracket-loader.js

document.addEventListener('DOMContentLoaded', () => {
    const playoffsContainer = document.getElementById('playoffs-container');
    if (!playoffsContainer) return;

    // Função para obter os dados: Prioriza o localStorage, senão usa o padrão
    const getChampionshipData = () => {
        try {
            const storedData = localStorage.getItem('championshipData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                if (parsedData && parsedData.playoffs) {
                    return parsedData; // Usa os dados salvos pelo Admin
                }
            }
        } catch (error) {
            console.error('Erro ao ler dados do localStorage. Usando dados padrão.', error);
        }
        return majorData; // Fallback para os dados originais
    };
    
    const data = getChampionshipData();

    const createTeamHTML = (teamId, score, isWinner) => {
        const team = teamId ? majorTeams[teamId] : null;
        const teamName = team ? team.name : 'A definir';
        const logo = teamId ? `assets/logos/${teamId}.png` : 'assets/logos/default.png';
        const fallbackLogo = team ? team.logo : 'https://i.imgur.com/3vNc3dZ.png'; // Um default genérico
        const scoreDisplay = (score !== undefined && teamId) ? `<span class="team-score ${isWinner ? 'winner' : ''}">${score}</span>` : '';

        return `
            <div class="team ${isWinner ? 'winner' : ''} ${!teamId ? 'tbd' : ''}">
                <img src="${logo}" alt="${teamName}" class="team-logo" onerror="this.onerror=null;this.src='${fallbackLogo}';">
                <span class="team-name">${teamName}</span>
                ${scoreDisplay}
            </div>
        `;
    };
    
    const createMatchHTML = (match) => {
        const isConcluded = match.status === 'Concluído' || match.status === 'Finalizado';
        const winnerId = isConcluded ? (match.score1 > match.score2 ? match.team1 : match.team2) : null;

        const team1HTML = createTeamHTML(match.team1, match.score1, winnerId === match.team1);
        const team2HTML = createTeamHTML(match.team2, match.score2, winnerId === match.team2);
        
        return `<div class="match">${team1HTML}<div class="match-meta">${match.date || ''}</div>${team2HTML}</div>`;
    };
    
    const renderPlayoffs = (playoffsData) => {
        let html = '<div class="tournament-bracket-visual">';
        
        const stages = ['quarterFinals', 'semiFinals', 'finals'];
        const stageTitles = {
            quarterFinals: 'Quartas de Final',
            semiFinals: 'Semifinais',
            finals: 'Grande Final'
        };
        
        stages.forEach(stageKey => {
            html += `<div class="stage" id="${stageKey}-stage">`;
            html += `<h2 class="stage-title">${stageTitles[stageKey]}</h2>`;
            html += '<div class="matches-column">';
            playoffsData[stageKey].forEach(match => {
                html += createMatchHTML(match);
            });
            html += '</div></div>';
        });

        // Lógica para determinar o campeão
        const finalMatch = playoffsData.finals[0];
        let championHTML = '<div class="champion-display-placeholder"><span>Aguardando Campeão</span><i class="fas fa-trophy"></i></div>';
        if ((finalMatch.status === 'Concluído' || finalMatch.status === 'Finalizado') && finalMatch.team1 && finalMatch.team2) {
            const championId = finalMatch.score1 > finalMatch.score2 ? finalMatch.team1 : finalMatch.team2;
            const championTeam = majorTeams[championId];
            if (championTeam) {
                const logo = `assets/logos/${championId}.png`;
                const fallbackLogo = championTeam.logo;
                championHTML = `
                    <div class="champion-display">
                        <img src="${logo}" alt="${championTeam.name}" class="champion-logo" onerror="this.onerror=null;this.src='${fallbackLogo}';">
                        <span class="champion-name">${championTeam.name}</span>
                        <div class="champion-title"><i class="fas fa-trophy"></i> CAMPEÃO DO MAJOR</div>
                    </div>
                `;
            }
        }

        html += `<div class="stage" id="champion-stage"><h2 class="stage-title">Campeão</h2>${championHTML}</div>`;
        html += '</div>';
        playoffsContainer.innerHTML = html;
    };
    
    renderPlayoffs(data.playoffs);
});