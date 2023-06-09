import './App.css';

import { useState } from 'react';

import { GameLayout, WelcomeLayout } from '@/layouts';

function App() {
	const [gameStarted, setGameStarted] = useState<boolean>(false);

	const onStartGame = () => {
		setGameStarted(true);
	};

	if (!gameStarted) {
		return <WelcomeLayout onClickStart={onStartGame} />;
	}

	return <GameLayout />;
}

export default App;
