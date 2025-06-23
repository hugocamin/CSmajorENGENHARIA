// admin/admin.js

document.addEventListener('DOMContentLoaded', () => {
    // --- SEGURANÇA SIMPLES ---
    if (window.location.pathname.includes('/admin/') && !sessionStorage.getItem('isAdminAuthenticated')) {
        if (!window.location.pathname.endsWith('login.html')) {
            window.location.href = '../login.html';
        }
        return;
    }
    
    // Disponibiliza a função de logout globalmente para o onclick no HTML
    window.logout = function() {
        if (confirm('Tem certeza que deseja sair do painel?')) {
            sessionStorage.removeItem('isAdminAuthenticated');
            window.location.href = '../login.html';
        }
    }

    const getChampionshipData = () => {
        try {
            const storedData = localStorage.getItem('championshipData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                if (parsedData && parsedData.playoffs) {
                    return parsedData;
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados do localStorage:', error);
            localStorage.removeItem('championshipData');
        }
        return JSON.parse(JSON.stringify(majorData)); // Retorna uma cópia limpa dos dados padrão
    };

    const saveChampionshipData = (data) => {
        try {
            if (!data || !data.playoffs) throw new Error('Dados inválidos para salvar');
            localStorage.setItem('championshipData', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            showMessage('Erro ao salvar dados: ' + error.message, 'error');
            return false;
        }
    };

    /**
     * FUNÇÃO CORRIGIDA E SIMPLIFICADA
     * Esta versão não limpa mais nada. Ela apenas avança os vencedores para a próxima fase,
     * preservando todos os dados que você inseriu.
     */
    const propagateWinners = (data) => {
        // Zera as posições futuras para garantir que apenas os vencedores corretos sejam propagados
        data.playoffs.semiFinals.forEach(match => { match.team1 = null; match.team2 = null; });
        data.playoffs.finals[0].team1 = null;
        data.playoffs.finals[0].team2 = null;
    
        // Propaga das Quartas para as Semifinais
        data.playoffs.quarterFinals.forEach((match, index) => {
            if ((match.status === 'Concluído' || match.status === 'Finalizado') && match.team1 && match.team2 && match.score1 !== match.score2) {
                const winnerId = match.score1 > match.score2 ? match.team1 : match.team2;
                const sfIndex = Math.floor(index / 2);
                const sfPosition = index % 2 === 0 ? 'team1' : 'team2';
                
                if(data.playoffs.semiFinals[sfIndex]) {
                    data.playoffs.semiFinals[sfIndex][sfPosition] = winnerId;
                }
            }
        });
    
        // Propaga das Semifinais para a Final
        data.playoffs.semiFinals.forEach((match, index) => {
            if ((match.status === 'Concluído' || match.status === 'Finalizado') && match.team1 && match.team2 && match.score1 !== match.score2) {
                const winnerId = match.score1 > match.score2 ? match.team1 : match.team2;
                const finalPosition = index === 0 ? 'team1' : 'team2';
                
                if(data.playoffs.finals[0]) {
                   data.playoffs.finals[0][finalPosition] = winnerId;
                }
            }
        });
        
        return data;
    };
    
    const getAllTeamsOptions = (selectedId) => {
        let opts = '<option value="">A definir</option>';
        for (const [id, team] of Object.entries(majorTeams)) {
            opts += `<option value="${id}" ${selectedId === id ? 'selected' : ''}>${team.name}</option>`;
        }
        return opts;
    };

    const getTeamLogo = (teamId) => {
        if (!teamId || !majorTeams[teamId]) return '../assets/logos/default.png'; 
        return `../assets/logos/${teamId}.png`;
    };

    const showMessage = (msg, type = 'success') => {
        let msgDiv = document.getElementById('admin-msg');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.id = 'admin-msg';
            document.body.appendChild(msgDiv);
        }
        msgDiv.textContent = msg;
        msgDiv.className = `admin-message ${type}`;
        msgDiv.style.display = 'block';
        setTimeout(() => { msgDiv.style.display = 'none'; }, 3000);
    };

    const renderEditableMatch = (match, stage, idx) => {
        const t1 = match.team1 ? majorTeams[match.team1] : null;
        const t2 = match.team2 ? majorTeams[match.team2] : null;

        const t1Select = `<select name="team1" class="team-select">${getAllTeamsOptions(match.team1)}</select>`;
        const t2Select = `<select name="team2" class="team-select">${getAllTeamsOptions(match.team2)}</select>`;
        const t1Logo = `<img src="${getTeamLogo(match.team1)}" class="team-logo" alt="${t1?.name || ''}">`;
        const t2Logo = `<img src="${getTeamLogo(match.team2)}" class="team-logo" alt="${t2?.name || ''}">`;
        
        return `
        <form class="admin-match-row" data-stage="${stage}" data-idx="${idx}" onsubmit="return false;">
            <div class="match-team-control">${t1Logo} ${t1Select}</div>
            <div class="match-score-control">
                <input type="number" min="0" max="3" value="${match.score1 ?? ''}" name="score1">
                <span>x</span>
                <input type="number" min="0" max="3" value="${match.score2 ?? ''}" name="score2">
            </div>
            <div class="match-team-control">${t2Select} ${t2Logo}</div>
            <div class="match-meta-control">
                <select name="status">
                    <option value="A Seguir" ${match.status === 'A Seguir' ? 'selected' : ''}>A Seguir</option>
                    <option value="Ao Vivo" ${match.status === 'Ao Vivo' ? 'selected' : ''}>Ao Vivo</option>
                    <option value="Concluído" ${match.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                    <option value="Finalizado" ${match.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                </select>
                <input type="text" value="${match.date ?? ''}" name="date" placeholder="Data/Hora">
            </div>
            <button type="button" class="btn btn-primary btn-save-match"><i class="fas fa-save"></i> Salvar</button>
        </form>`;
    };

    const dashboardPageLogic = () => {
        const btn = document.getElementById('seed-playoffs-btn');
        const matchesList = document.getElementById('playoffs-matches-list');

        if (btn) {
            btn.onclick = () => {
                if (confirm('Tem certeza que deseja resetar os playoffs? Todos os resultados e times definidos serão perdidos.')) {
                    localStorage.removeItem('championshipData');
                    showMessage('Playoffs resetados para o padrão!', 'success');
                    setTimeout(() => window.location.reload(), 1200);
                }
            };
        }

        if (matchesList) {
            const renderDashboard = () => {
                let currentData = getChampionshipData();
                
                // Antes de renderizar, aplicamos a propagação para garantir que o painel mostre o estado mais recente
                // Esta é uma operação apenas de leitura para a renderização, os dados reais são atualizados no clique
                const displayData = propagateWinners(JSON.parse(JSON.stringify(currentData)));
                
                matchesList.innerHTML = '';
                ['quarterFinals','semiFinals','finals'].forEach(stage => {
                    const stageTitle = { quarterFinals: 'Quartas de Final', semiFinals: 'Semifinais', finals: 'Grande Final' }[stage];
                    const stageDiv = document.createElement('div');
                    stageDiv.className = 'stage-management';
                    stageDiv.innerHTML = `<h3>${stageTitle}</h3>`;
                    
                    // Usamos o displayData para renderizar, que já tem os times propagados
                    displayData.playoffs[stage].forEach((match, idx) => {
                        // Mas para os valores dos inputs (placar, status) usamos os dados originais
                        const originalMatch = currentData.playoffs[stage][idx];
                        match.score1 = originalMatch.score1;
                        match.score2 = originalMatch.score2;
                        match.status = originalMatch.status;
                        match.date = originalMatch.date;
                        stageDiv.innerHTML += renderEditableMatch(match, stage, idx);
                    });
                    matchesList.appendChild(stageDiv);
                });
                
                matchesList.querySelectorAll('.btn-save-match').forEach(btn => {
                    btn.onclick = function() {
                        const form = this.closest('form');
                        const stage = form.dataset.stage;
                        const idx = parseInt(form.dataset.idx);
                        
                        let dataToUpdate = getChampionshipData();

                        // Atualiza o placar e status na partida correspondente
                        const match = dataToUpdate.playoffs[stage][idx];
                        match.score1 = parseInt(form.score1.value) || 0;
                        match.score2 = parseInt(form.score2.value) || 0;
                        match.status = form.status.value;
                        match.date = form.date.value;
                        // Opcional: Atualizar times se forem alterados manualmente
                        match.team1 = form.team1.value || null;
                        match.team2 = form.team2.value || null;

                        // Recalcula toda a chave a partir dos dados atualizados e salva
                        let finalData = propagateWinners(dataToUpdate);
                        if (saveChampionshipData(finalData)) {
                            showMessage('Partida atualizada e vencedores propagados!', 'success');
                            renderDashboard(); // Re-renderiza o painel para refletir os avanços
                        }
                    };
                });
            }
            renderDashboard();
        }
    };
    
    // Roda a lógica da página do dashboard
    if (document.getElementById('playoffs-matches-list')) {
        dashboardPageLogic();
    }
});