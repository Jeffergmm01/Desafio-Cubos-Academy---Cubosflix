const colecaoFilmes = document.querySelector('.movies');
const botaoVoltar = document.querySelector('.btn-prev');
const botaoAvancar = document.querySelector('.btn-next');
const campoPesquisar = document.querySelector('.input');
const fotoPrincipalFilmeDoDia = document.querySelector('.highlight__video');
const tituloFilmeDoDia = document.querySelector('.highlight__title');
const notaFilmeDoDia = document.querySelector('.highlight__rating');
const generoFilmeDoDia = document.querySelector('.highlight__genres');
const dataFilmeDoDia = document.querySelector('.highlight__launch');
const DescricaoFilmeDoDia = document.querySelector('.highlight__description');
const videoFilmeDoDia = document.querySelector('.highlight__video-link');
const modalFilmeSelecionado = document.querySelector('.hidden');
const modalCompleto = document.querySelector('.modal');
const tituloModal = document.querySelector('.modal__title');
const imagemModal = document.querySelector('.modal__img');
const descricaoModal = document.querySelector('.modal__description');
const notaModal = document.querySelector('.modal__average');
const divGeneros = document.querySelector('.modal__genres');
const botaoTemaPagina = document.querySelector('.btn-theme');
const rootCores = document.querySelector(':root');
const logoCubos = document.querySelector('.header__container-logo img');
const botaoFecharModal = document.querySelector('.modal__body img');

let paginaAtualFileiraDeFilmes = 0;

let filmePesquisadoPeloUsuario = false;

let arrayDeIdsFilmesNaTela = [];

async function importarInformacoesApi() {
  try {
    const resposta = await api.get('/3/discover/movie?language=pt-BR&include_adult=false', {
    });

    const filmes = resposta.data.results;

    listarFilmesDaApi(filmes);

    filmePesquisadoPeloUsuario = false;

    return;
  } catch (erro) {
    console.log(erro.resposta.data);

  };
};

function listarFilmesDaApi(filmes) {

  if (filmes.length <= 6) {
    botaoAvancar.style.visibility = 'hidden';
    botaoVoltar.style.visibility = 'hidden';
  } else {
    botaoAvancar.style.visibility = 'visible';
    botaoVoltar.style.visibility = 'visible';
  }

  if (paginaAtualFileiraDeFilmes === 0) {
    const novaListadeFilmes = filmes.slice(0, 6);
    for (let filme of novaListadeFilmes) {
      criarNovoCard(filme);

    };
  };

  if (filmes.length > 6 && filmes.length <= 12) {
    if (paginaAtualFileiraDeFilmes === 0) {
      botaoVoltar.style.visibility = 'hidden';
    } else {
      botaoVoltar.style.visibility = 'visible';
    };

    if (paginaAtualFileiraDeFilmes === 1) {
      botaoAvancar.style.visibility = 'hidden';
    } else {
      botaoAvancar.style.visibility = 'visible';
    };
  };

  if (paginaAtualFileiraDeFilmes === 1) {
    const novaListadeFilmes = filmes.slice(6, 12);
    for (let filme of novaListadeFilmes) {
      criarNovoCard(filme);

    };
  };

  if (paginaAtualFileiraDeFilmes === 2) {
    const novaListadeFilmes = filmes.slice(12, 18);
    for (let filme of novaListadeFilmes) {
      criarNovoCard(filme);

    };
  };

  atribuirEventoDeCliqueAosCardsNaTela();
}

function criarNovoCard(informacoesDoFilmeInformadoAPI) {
  const cartaoFilme = document.createElement('div');
  const informacoesFilme = document.createElement('div');
  const tituloFilme = document.createElement('span');
  const uniaoNotaEstrela = document.createElement('div');
  const notaDoFilme = document.createElement('span');
  const estrelaFilme = document.createElement('img');

  cartaoFilme.classList.add('movie');
  informacoesFilme.classList.add('movie__info');
  uniaoNotaEstrela.classList.add('movie__title-rating')
  tituloFilme.classList.add('movie__title');
  notaDoFilme.classList.add('movie__rating');

  colecaoFilmes.appendChild(cartaoFilme);
  cartaoFilme.appendChild(informacoesFilme);
  informacoesFilme.appendChild(tituloFilme);
  informacoesFilme.appendChild(uniaoNotaEstrela);
  uniaoNotaEstrela.appendChild(notaDoFilme);
  uniaoNotaEstrela.appendChild(estrelaFilme);


  if (!informacoesDoFilmeInformadoAPI.poster_path) {
    informacoesDoFilmeInformadoAPI.poster_path = `./assets/filme-sem-cartaz.png`
  }

  cartaoFilme.style.backgroundImage = `url(${informacoesDoFilmeInformadoAPI.poster_path})`;
  tituloFilme.textContent = `${informacoesDoFilmeInformadoAPI.title}`;
  notaDoFilme.textContent = `${informacoesDoFilmeInformadoAPI.vote_average.toFixed(1)}`;
  estrelaFilme.src = `./assets/estrela.svg`;
  estrelaFilme.alt = `Estrela`;


  arrayDeIdsFilmesNaTela.push(informacoesDoFilmeInformadoAPI.id);
};

function removerTodosOsCards() {
  const todosOsCards = document.querySelectorAll('.movie');

  for (let card of todosOsCards) {
    card.parentNode.removeChild(card);
  };

  arrayDeIdsFilmesNaTela = [];
};

function removerTodosOsGenerosModal() {
  let todosOsGeneros = document.querySelectorAll('.modal__genre');

  for (let genero of todosOsGeneros) {
    genero.parentNode.removeChild(genero);
  };
}

botaoVoltar.addEventListener('click', function () {

  if (paginaAtualFileiraDeFilmes === 0) {
    paginaAtualFileiraDeFilmes = 2;
  } else {
    paginaAtualFileiraDeFilmes--;
  };

  removerTodosOsCards();
  if (!filmePesquisadoPeloUsuario) {
    importarInformacoesApi();
  } else {
    buscarFilme();
  };

});

botaoAvancar.addEventListener('click', function () {

  if (paginaAtualFileiraDeFilmes === 2) {
    paginaAtualFileiraDeFilmes = 0;
  } else {
    paginaAtualFileiraDeFilmes++;
  };

  removerTodosOsCards();

  if (!filmePesquisadoPeloUsuario) {
    importarInformacoesApi();
  } else {
    buscarFilme();
  };

});

let memoriaFilmePesquisado = 0;

async function buscarFilme(nomeDoFilmeParaPesquisa) {
  try {
    if (nomeDoFilmeParaPesquisa === undefined) {
      nomeDoFilmeParaPesquisa = memoriaFilmePesquisado;
    } else if (nomeDoFilmeParaPesquisa !== memoriaFilmePesquisado) {
      memoriaFilmePesquisado = nomeDoFilmeParaPesquisa;
      paginaAtualFileiraDeFilmes = 0;
    };

    const resposta = await api.get(`/3/search/movie?language=pt-BR&include_adult=false&query=${nomeDoFilmeParaPesquisa}`, {
    });

    removerTodosOsCards();

    let filmes = resposta.data.results;

    listarFilmesDaApi(filmes);

    filmePesquisadoPeloUsuario = true;

  } catch (erro) {
    console.log(erro.resposta.data);
  };
};

campoPesquisar.addEventListener('keyup', function (evento) {
  evento.stopPropagation();
  evento.preventDefault();

  if (evento.key === 'Enter' && !campoPesquisar.value.trim()) {
    campoPesquisar.value = '';
    paginaAtualFileiraDeFilmes = 0;
    botaoAvancar.style.visibility = 'visible';
    botaoVoltar.style.visibility = 'visible';
    removerTodosOsCards();
    importarInformacoesApi();
  };

  if (evento.key === 'Enter' && campoPesquisar.value) {
    buscarFilme(campoPesquisar.value);
    campoPesquisar.value = '';
  };
});

async function exibirFilmeDoDia() {
  try {
    const resposta = await api.get(`/3/movie/436969?language=pt-BR`, {
    });

    const filme = resposta.data;

    fotoPrincipalFilmeDoDia.style.backgroundImage = `url(${filme.backdrop_path})`;
    tituloFilmeDoDia.textContent = `${filme.title}`;
    notaFilmeDoDia.textContent = `${filme.vote_average.toFixed(1)}`;

    let unificacaoGeneroFilmeDoDia = [];

    for (let genero of filme.genres) {
      unificacaoGeneroFilmeDoDia.push(genero.name);
    };
    unificacaoGeneroFilmeDoDia = unificacaoGeneroFilmeDoDia.join(', ');

    generoFilmeDoDia.textContent = `${unificacaoGeneroFilmeDoDia}`;

    const novaData = new Date(filme.release_date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
    dataFilmeDoDia.textContent = `/ ${novaData}`;
    DescricaoFilmeDoDia.textContent = `${filme.overview}`;

    exibirVideoFilmeDoDia(idFilmeDoDia)
  } catch (erro) {
    console.log(erro.resposta.data);
  };
};

async function exibirVideoFilmeDoDia(idFilmeDoDia) {
  try {
    const resposta = await api.get(`/3/movie/436969/videos?language=pt-BR`, {
    });

    const linkVideoFilmeDoDia = resposta.data.results[0].key;

    const novoLinkVideoFilmeDoDia = "https://www.youtube.com/watch?v=" + linkVideoFilmeDoDia;

    videoFilmeDoDia.href = `${novoLinkVideoFilmeDoDia}`;

  } catch (error) {
    console.log(erro.resposta.data);
  };
};

function atribuirEventoDeCliqueAosCardsNaTela() {
  const todosOsCards = document.querySelectorAll('.movie');

  let todosOsCardsArray = Array.from(todosOsCards);

  for (let card of todosOsCards) {
    card.addEventListener('click', function (evento) {
      evento.preventDefault();
      evento.stopPropagation();
      modalFilmeSelecionado.classList.remove('hidden');

      const cliqueUsuario = todosOsCardsArray.indexOf(card);
      exibirModalFilmeSelecionado(cliqueUsuario);
    });
  };
};

async function exibirModalFilmeSelecionado(cliqueUsuario) {
  const idFilmeSelecionado = arrayDeIdsFilmesNaTela[cliqueUsuario];
  try {
    const resposta = await api.get(`/3/movie/${idFilmeSelecionado}?language=pt-BR`, {
    });

    const filme = resposta.data;

    if (!filme.backdrop_path) {
      filme.backdrop_path = `./assets/filme-sem-poster.png`
    }

    if (!filme.overview) {
      filme.overview = `Este filme não contém descrição.`
    }

    tituloModal.textContent = `${filme.title}`;
    imagemModal.src = `${filme.backdrop_path}`;
    descricaoModal.textContent = `${filme.overview}`;
    notaModal.textContent = `${filme.vote_average.toFixed(1)}`;

    for (let genero of filme.genres) {
      const novoGenero = document.createElement('span');

      novoGenero.classList.add('modal__genre');

      divGeneros.appendChild(novoGenero);

      novoGenero.textContent = `${genero.name}`;
    };

  } catch (erro) {
    console.log(erro.resposta.data);
  };
};

modalCompleto.addEventListener('click', function (evento) {
  evento.preventDefault();
  evento.stopPropagation();

  modalCompleto.classList.add('hidden');

  tituloModal.textContent = ``;
  imagemModal.src = ``;
  descricaoModal.textContent = ``;
  notaModal.textContent = ``;

  removerTodosOsGenerosModal();

});

function definirTemaDaPagina() {
  const temaAtual = localStorage.getItem('tema');

  if (!temaAtual || temaAtual === 'claro') {
    botaoTemaPagina.src = `./assets/light-mode.svg`;
    botaoAvancar.src = `./assets/arrow-right-dark.svg`;
    botaoVoltar.src = `./assets/arrow-left-dark.svg`;
    logoCubos.src = `./assets/logo-dark.png`;
    botaoFecharModal.src = `./assets/close-dark.svg`;
    rootCores.style.setProperty('--background', '#fff');
    rootCores.style.setProperty('--input-color', '#979797');
    rootCores.style.setProperty('--text-color', '#1b2028');
    rootCores.style.setProperty('--bg-secondary', '#ededed');
    rootCores.style.setProperty('--bg-modal', '#ededed');
    return;
  };

  if (temaAtual === 'escuro') {
    botaoTemaPagina.src = `./assets/dark-mode.svg`;
    botaoAvancar.src = `./assets/arrow-right-light.svg`;
    botaoVoltar.src = `./assets/arrow-left-light.svg`;
    logoCubos.src = `./assets/logo.svg`;
    botaoFecharModal.src = `./assets/close.svg`;
    rootCores.style.setProperty('--background', '#1B2028');
    rootCores.style.setProperty('--input-color', '#ffffff');
    rootCores.style.setProperty('--text-color', '#ffffff');
    rootCores.style.setProperty('--bg-secondary', '#2D3440');
    rootCores.style.setProperty('--bg-modal', '#2D3440');
  };
};

botaoTemaPagina.addEventListener('click', function (evento) {
  evento.preventDefault();
  evento.stopPropagation();

  const temaAtual = localStorage.getItem('tema');

  if (!temaAtual || temaAtual === 'claro') {
    localStorage.setItem('tema', 'escuro');
    definirTemaDaPagina();
    return;
  };

  localStorage.setItem('tema', 'claro');
  definirTemaDaPagina();
});

definirTemaDaPagina();
importarInformacoesApi();
exibirFilmeDoDia();
