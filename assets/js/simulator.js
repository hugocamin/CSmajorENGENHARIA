// assets/js/simulator.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. VERIFICAÇÃO DE DADOS
    if (typeof majorData === 'undefined' || typeof majorTeams === 'undefined') {
        console.error("ERRO CRÍTICO: majorData.js não foi carregado.");
        return;
    }

    // 2. MAPEAMENTO DOS ELEMENTOS (DOM)
    const DOM = {
        qfList: document.getElementById('qf-list'),
        sfList: document.getElementById('sf-list'),
        finalList: document.getElementById('final-list'),
        championArea: document.getElementById('champion-area'),
        resetBtn: document.getElementById('resetBtn'),
        championCard: document.getElementById('championCard'),
        championLogo: document.querySelector('#championCard .champion-logo'),
        championName: document.querySelector('#championCard .champion-name'),
        closeChampionCardBtn: document.querySelector('#championCard .close-btn'),
    };
    
    // 3. ESTADO DA SIMULAÇÃO (AGORA BASEADO EM VENCEDORES DE CONFRONTOS)
    let simulationState = {};

    // 4. FUNÇÃO DE RENDERIZAÇÃO PRINCIPAL
    const render = () => {
        renderQuarterFinals();
        renderSemiFinals();
        renderFinal();
        renderChampion();
    };
    
    // 5. FUNÇÕES DE RENDERIZAÇÃO POR FASE (REESTRUTURADAS)
    const renderQuarterFinals = () => {
        DOM.qfList.innerHTML = '';
        majorData.playoffs.quarterFinals.forEach((match, index) => {
            const winnerId = simulationState.quarterFinals[index];
            DOM.qfList.innerHTML += createMatchHTML([match.team1, match.team2], 'quarterFinals', index, winnerId);
        });
    };

    const renderSemiFinals = () => {
        DOM.sfList.innerHTML = '';
        const sfMatches = [
            [simulationState.quarterFinals[0], simulationState.quarterFinals[1]],
            [simulationState.quarterFinals[2], simulationState.quarterFinals[3]]
        ];
        sfMatches.forEach((match, index) => {
            const winnerId = simulationState.semiFinals[index];
            DOM.sfList.innerHTML += createMatchHTML(match, 'semiFinals', index, winnerId);
        });
    };

    const renderFinal = () => {
        DOM.finalList.innerHTML = '';
        const finalMatch = [simulationState.semiFinals[0], simulationState.semiFinals[1]];
        const winnerId = simulationState.final[0];
        DOM.finalList.innerHTML += createMatchHTML(finalMatch, 'final', 0, winnerId);
    };

    const renderChampion = () => {
        DOM.championArea.innerHTML = '';
        const championId = simulationState.final[0];
        if (championId) {
            DOM.championArea.innerHTML = `
                <div class="champion-display-final">
                    <i class="fas fa-trophy trophy"></i>
                    <span class="name">${majorTeams[championId].name}</span>
                </div>
            `;
        } else {
            DOM.championArea.innerHTML = `<div class="team-list-placeholder">Aguardando...</div>`;
        }
    };
    
    // 6. FUNÇÕES DE CRIAÇÃO DE HTML (MODIFICADAS)
    const createMatchHTML = (teams, stage, matchIndex, winnerId) => {
        if (!teams[0] || !teams[1]) {
            return '<div class="team-list-placeholder">Aguardando...</div>';
        }
        
        const team1Button = createTeamButtonHTML(teams[0], stage, matchIndex, winnerId);
        const team2Button = createTeamButtonHTML(teams[1], stage, matchIndex, winnerId);

        return `<div class="match-container">${team1Button}${team2Button}</div>`;
    };

    const createTeamButtonHTML = (teamId, stage, matchIndex, winnerId) => {
        const team = majorTeams[teamId];
        const isSelected = teamId === winnerId;
        return `
            <button class="team-button ${isSelected ? 'selected' : ''}" 
                    data-team-id="${teamId}" 
                    data-stage="${stage}" 
                    data-match-index="${matchIndex}">
                <img src="assets/logos/${teamId}.png" alt="${team.name}" class="team-logo" onerror="this.onerror=null;this.src='${team.logo}';">
                <span>${team.name}</span>
            </button>
        `;
    };

    // 7. MANIPULADOR DE CLIQUE PRINCIPAL (LÓGICA CORRIGIDA)
    const handleBracketClick = (e) => {
        const button = e.target.closest('.team-button');
        if (!button) return;

        const teamId = button.dataset.teamId;
        const stage = button.dataset.stage;
        const matchIndex = parseInt(button.dataset.matchIndex, 10);

        // Define o vencedor do confronto
        simulationState[stage][matchIndex] = teamId;

        // Se for a final, mostra o card do campeão
        if (stage === 'final') {
            showChampionCard(teamId);
        }

        // Re-renderiza tudo para refletir as mudanças
        render();
    };
    
    const showChampionCard = (winnerId) => {
        const winnerTeam = majorTeams[winnerId];
        DOM.championLogo.src = `assets/logos/${winnerId}.png`;
        DOM.championName.textContent = winnerTeam.name;
        DOM.championCard.classList.remove('hidden');
        if (window.confetti) confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    };

    // 8. INICIALIZAÇÃO E RESET
    const initialize = () => {
        simulationState = {
            quarterFinals: [null, null, null, null],
            semiFinals: [null, null],
            final: [null],
        };
        
        DOM.championCard.classList.add('hidden');
        render();
    };

    // 9. ADICIONA OS EVENT LISTENERS
    document.getElementById('simulator-bracket').addEventListener('click', handleBracketClick);
    DOM.resetBtn.addEventListener('click', initialize);
    DOM.closeChampionCardBtn.addEventListener('click', () => DOM.championCard.classList.add('hidden'));

    // Inicia o simulador pela primeira vez
    initialize();
});