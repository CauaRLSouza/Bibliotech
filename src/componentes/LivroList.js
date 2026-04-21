import React from 'react';

function LivroList({ books, adicionarAoCarrinho, comprasFinalizadas }) {
  return (
    <div className="book-grid">
      {books.map((livro) => {
        const jaPossui = comprasFinalizadas.some(item => item.id === livro.id);

        return (
          <div key={livro.id} className="book-card">
            <img src={livro.capa} alt={livro.titulo} />
            <h3>{livro.titulo}</h3>
            <p>R$ {livro.preco.toFixed(2)}</p>

            {jaPossui ? (
              <div className="posse-container">
                <span className="msg-ja-possui">Você já possui este livro no seu acervo pessoal</span>
              </div>
            ) : (
              <>
                <button className="btn-buy" onClick={() => adicionarAoCarrinho(livro, true)}>
                  Comprar Agora
                </button>
                <button className="btn-cart" onClick={() => adicionarAoCarrinho(livro)}>
                  Adicionar ao Carrinho
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LivroList;