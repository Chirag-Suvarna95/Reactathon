import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = 'https://api.pokemontcg.io/v2/cards';

const allPokemonTypes = [
  'Normal',
  'Fire',
  'Water',
  'Lightning',
  'Grass',
  'Metal',
  'Fighting',
  'Psychic',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
];

function SelectedCard({ card, onClose, position }) {
  const cardRef = useRef(null);

  useEffect(() => {
    cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, []);

  return (
    <div
      ref={cardRef}
      className="selected-card"
      style={{ position, top: position === 'fixed' ? 0 : 'auto' }}
    >
      <h2>{card.name}</h2>
      <p>Type: {card.types.join(', ')}</p>
      {/* Add additional details as needed */}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

function App() {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardPosition, setSelectedCardPosition] = useState('relative');

  useEffect(() => {
    const fetchKantoCards = async () => {
      try {
        const response = await fetch(`${API_URL}?page=1&pageSize=50&set=base1`);
        const data = await response.json();
        setCards(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchKantoCards();
  }, []);

  useEffect(() => {
    const filtered = cards.filter(
      (card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedType === '' || card.types.includes(selectedType))
    );
    setFilteredCards(filtered);
  }, [searchTerm, selectedType, cards]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setSelectedCardPosition('fixed');
  };

  const handleCloseCard = () => {
    setSelectedCard(null);
    setSelectedCardPosition('relative');
  };

  return (
    <div className="App">
      <h1>Pokemon Card Collection</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          {allPokemonTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="card-container">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="card"
            onClick={() => handleCardClick(card)}
          >
            <img src={card.images.small} alt={card.name} />
            <h3>{card.name}</h3>
            <p>Type: {card.types.join(', ')}</p>
          </div>
        ))}
      </div>

      {selectedCard && (
        <SelectedCard
          card={selectedCard}
          onClose={handleCloseCard}
          position={selectedCardPosition}
        />
      )}
    </div>
  );
}

export default App;
