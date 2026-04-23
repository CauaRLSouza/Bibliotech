import React, { useState, useEffect } from "react";
import LivroList from "./componentes/LivroList";
import { LivrosHome } from "./livros/livros";
import "./styles/geral.css";
import "./styles/acervo.css";
import "./styles/aviso.css";
import "./styles/botao_home.css";
import "./styles/buscar.css";
import "./styles/carrinho.css";
import "./styles/header.css";
import "./styles/leitura.css";
import "./styles/resumo.css";

function App() {
  const [books] = useState(LivrosHome);
  const [carrinho, setCarrinho] = useState(() => {
    const salvo = localStorage.getItem("carrinho");
    return salvo ? JSON.parse(salvo) : [];
  });
  const [comprasFinalizadas, setComprasFinalizadas] = useState(() => {
    const salvo = localStorage.getItem("pedidos");
    return salvo ? JSON.parse(salvo) : [];
  });
  const [busca, setBusca] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [livroEmLeitura, setLivroEmLeitura] = useState(null);
  const [aviso, setAviso] = useState({ visivel: false, texto: "", callback: null });

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(comprasFinalizadas));
  }, [comprasFinalizadas]);

  function mostrarAviso(texto, callback = null) {
    setAviso({ visivel: true, texto, callback });
    if (!callback) {
      setTimeout(() => setAviso({ visivel: false, texto: "", callback: null }), 2000);
    }
  }

  function adicionarAoCarrinho(livro, checkoutDireto = false) {
    const jaPossuiNoAcervo = comprasFinalizadas.some(item => item.id === livro.id);
    if (jaPossuiNoAcervo) {
      mostrarAviso("Você já possui este livro no seu Acervo Pessoal");
      return;
    }
    setCarrinho(prev => {
      const itemExiste = prev.find(item => item.id === livro.id);
      if (itemExiste) {
        return prev.map(item =>
          item.id === livro.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prev, { ...livro, quantidade: 1 }];
    });
    if (checkoutDireto) setAbaAtiva("carrinho");
    else mostrarAviso(`${livro.titulo} no carrinho!`);
  }

  function abrirLeitura(livro) {
    setLivroEmLeitura(livro);
    setAbaAtiva("leitura");
  }

  function alterarQuantidade(id, delta) {
    setCarrinho(prev => prev.map(item => {
      if (item.id === id) {
        const novaQtd = item.quantidade + delta;
        return novaQtd > 0 ? { ...item, quantidade: novaQtd } : item;
      }
      return item;
    }));
  }

  function removerDoCarrinho(id) {
    setCarrinho(carrinho.filter(item => item.id !== id));
  }

  function finalizarCompra() {
    if (carrinho.length === 0) return;
    setComprasFinalizadas([...comprasFinalizadas, ...carrinho]);
    setCarrinho([]);
    setAbaAtiva("pedidos");
    mostrarAviso("Compra finalizada!");
  }

  function confirmarExclusao(index) {
    mostrarAviso("Excluir livro do acervo?", () => {
      setComprasFinalizadas(comprasFinalizadas.filter((_, i) => i !== index));
      setAviso({ visivel: false, texto: "", callback: null });
    });
  }

  const livrosFiltrados = books.filter(b => b.titulo.toLowerCase().includes(busca.toLowerCase()));
  const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  return (
    <div className="app-container">
      {aviso.visivel && (
        <div className="overlay-aviso">
          <div className="modal-aviso">
            <p>{aviso.texto}</p>
            {aviso.callback && (
              <div className="botoes-aviso">
                <button className="btn-aviso btn-confirmar clickable" onClick={aviso.callback}>Sim</button>
                <button className="btn-aviso btn-cancelar clickable" onClick={() => setAviso({ visivel: false, texto: "", callback: null })}>Não</button>
              </div>
            )}
          </div>
        </div>
      )}

      {abaAtiva !== "leitura" && (
        <header className="main-header">
          <h1 className="logo clickable" onClick={() => setAbaAtiva("home")}>BIBLIOTECH</h1>
          <nav>
            <ul>
              <li className="clickable" onClick={() => setAbaAtiva("home")}>Início</li>
              <li className="clickable" onClick={() => setAbaAtiva("pedidos")}>Meu Acervo</li>
              <li className="clickable" onClick={() => setAbaAtiva("sobre")}>Sobre nós</li>
            </ul>
          </nav>
        </header>
      )}

      {abaAtiva !== "leitura" && abaAtiva !== "carrinho" && (
        <div className="floating-cart clickable" onClick={() => setAbaAtiva("carrinho")}>
          🛒
          {carrinho.length > 0 && <span className="badge-cart">{carrinho.length}</span>}
        </div>
      )}

      <main className="content">
        {abaAtiva === "home" && (
          <>
            <div className="search-container">
              <input className="search-input" placeholder="Com o que deseja gastar seus dinheiros hoje?" value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
            <LivroList books={livrosFiltrados} adicionarAoCarrinho={adicionarAoCarrinho} comprasFinalizadas={comprasFinalizadas} />
          </>
        )}

        {abaAtiva === "pedidos" && (
          <div className="page-container">
            <h2>Acervo Pessoal</h2>
            {comprasFinalizadas.length === 0 ? <p>Biblioteca vazia.</p> : (
              <div className="pedidos-list">
                {comprasFinalizadas.map((item, index) => (
                  <div key={index} className="pedido-item">
                    <div className="pedido-left-side">
                      <img src={item.capa} alt={item.titulo} className="mini-capa" />
                      <div className="pedido-info">
                        <p><strong>{item.titulo}</strong></p>
                        <span className="badge-ebook-green">E-book</span>
                      </div>
                    </div>
                    <div className="pedido-actions-side">
                      <button className="btn-read btn-arredondado clickable" onClick={() => abrirLeitura(item)}>Ler</button>
                      <button className="btn-delete-acervo btn-arredondado clickable" onClick={() => confirmarExclusao(index)}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {abaAtiva === "leitura" && (
          <div className="reading-mode">
            <header className="reading-header">
              <button className="btn-back-reading clickable" onClick={() => setAbaAtiva("pedidos")}>← Voltar</button>
              <h2>Seu Livro: {livroEmLeitura?.titulo}</h2>
            </header>
            <div className="reading-content">
              <img src="/Bibliotech.jpeg" alt="Logo Bibliotech" className="logo-leitura" />
            </div>
          </div>
        )}

        {abaAtiva === "sobre" && (
          <div className="page-container section-sobre">
            <h2>A Lenda da Bibliotech</h2>
            <p>
              A <strong>Bibliotech</strong> foi desenvolvida por <strong>Cauã</strong> para o projeto de Desenvolvimento WEB, 
              sendo imediatamente nomeada a melhor, mais confiável e modesta loja de livros online já desenvolvida na história.
            </p>
            <p className="p-destaque">
              Sinta-se livre para gastar todos os seus dinheiros aqui. Não se preocupe, seus dados estão tão seguros quanto um livro que ficou tanto tempo na mesma página que foi esquecido e acabou virando pé de guarda roupa.
            </p>
          </div>
        )}

        {abaAtiva === "carrinho" && (
          <div className="page-container">
            <h2>Meu Carrinho</h2>
            {carrinho.length === 0 ? <p>Carrinho vazio.</p> : (
              <>
                <div className="cart-list">
                  {carrinho.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-product-side">
                        <img src={item.capa} alt={item.titulo} className="cart-thumb" />
                        <div className="cart-info">
                          <strong>{item.titulo}</strong>
                          <span className="cart-price">R$ {item.preco.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="cart-action-side">
                        <div className="cart-qty-selector">
                          <button className="clickable" onClick={() => alterarQuantidade(item.id, -1)}>-</button>
                          <span>{item.quantidade}</span>
                          <button className="clickable" onClick={() => alterarQuantidade(item.id, 1)}>+</button>
                        </div>
                        <button className="btn-remove-item-text clickable" onClick={() => removerDoCarrinho(item.id)}>Remover item</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="total-row"><span>Total:</span><strong>R$ {totalCarrinho.toFixed(2)}</strong></div>
                  <div className="cart-summary-actions">
                    <button className="btn-finalizar clickable" onClick={finalizarCompra}>Finalizar Pagamento</button>
                    <button className="btn-continuar clickable" onClick={() => setAbaAtiva("home")}>Continuar Comprando</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;