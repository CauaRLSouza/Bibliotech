import { useState } from "react";

function LivroFormu({ addBook }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !author) return;

    addBook({
      title,
      author,
      price,
      quantity: Number(quantity)
    });

    setTitle("");
    setAuthor("");
    setPrice("");
    setQuantity("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Título"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        placeholder="Autor"
        value={author}
        onChange={e => setAuthor(e.target.value)}
      />

      <input
        placeholder="Preço"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Quantidade"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
      />

      <button>Adicionar</button>
    </form>
  );
}

export default LivroFormu;