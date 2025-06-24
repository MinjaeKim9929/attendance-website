import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
	const [items, setItems] = useState([]);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		axios
			.get('http://localhost:5000/api/items')
			.then((response) => setItems(response.data))
			.catch((error) => console.error('Error fetching items:', error));
	}, []);

	const addItem = async () => {
		try {
			const response = await axios.post('http://localhost:5000/api/items', {
				name,
				description,
			});
			setItems([...items, response.data]);
			setName('');
			setDescription('');
		} catch (error) {
			console.error('Error adding item:', error);
		}
	};

	return (
		<div>
			<h1>MERN Stack App</h1>
			<div>
				<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
				<input
					type="text"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Item description"
				/>
				<button onClick={addItem}>Add Item</button>
			</div>
			<h2>Items</h2>
			<ul>
				{items.map((item) => (
					<li key={item._id}>
						{item.name}: {item.description}
					</li>
				))}
			</ul>
		</div>
	);
}
