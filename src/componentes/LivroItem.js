import React from "react";

function LivroItem({ book, adicionarAoCarrinho }) {
  return (
    <div className="book-card">
      <img src={book.capa} alt={book.titulo} />
      <h3>{book.titulo}</h3>
      <p style={{ color: 'var(--bibliotech-blue)', fontWeight: 'bold' }}>
        R$ {book.preco.toFixed(2)}
      </p>
      
      <button 
        className="btn-buy" 
        onClick={() => adicionarAoCarrinho(book, true)}
      >
        Comprar Agora
      </button>

      <button 
        className="btn-cart" 
        onClick={() => {
          adicionarAoCarrinho(book, false);
          alert(`${book.titulo} adicionado ao carrinho!`);
        }}
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}

export default LivroItem;