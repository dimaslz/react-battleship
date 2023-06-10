import { useCallback, useEffect, useMemo, useState } from 'react';

import {
	BoatSettings,
	ComputerBoard,
	GameHistory,
	PlayerBoardView,
	ScoreBoard,
	ShotFeedback} from '@/components';
import { BOARD_SIZE, BOATS, PLAYER, SHOT_VALUE } from '@/constants';
import { useBoard, useGame } from '@/hooks';
import { boatIsSunk, generateItems } from '@/methods';
import { BoardBoxItem, Boat, BoatForPlayer, CursorPosition, Shot } from '@/types';
import { randomNumber, wait } from '@/utils';

import { ComputerWinsLayout, HumanWinsLayout } from '.';

let boatsForPlayer: BoatForPlayer[] = structuredClone(
	BOATS.map((boat) => ({
		...boat,
		pending: false,
		done: false,
	})),
);

function GameLayout() {
	const {
		scores,
		computerWins,
		humanWins,
		items,
		updateItems,
		board,
		turn,
		setTurn,
		maxScores,
	} = useBoard(
		structuredClone(generateItems()),
	);
	const [boxesOver, setBoxesOver] = useState<number[]>([]);
	const [showComputerBoats, setShowComputerBoats] = useState<boolean>(false);
	const [boatToSet, updateBoatsToSet] = useState<{ boat: BoatForPlayer; key: number; } | null>(null);
	const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(null);
	const [shotResult, setShotResult] = useState<{ type: Shot; content: string; } | null>(null);
	const {
		setBoatPosition,
		switchOrientation,
		randomOrientation,
		setGameReady,
		updateGameCounterValue,
		updateGameCounterLabel,
		updateBoatsInGame,
		gameReady,
		playersAreReady,
		history,
		counter,
		boatsInGame,
	} = useGame({
		setBoxesOver,
		items,
	});

	const isConflict = useMemo<boolean>(() => {
		return !!(
			boatToSet &&
			items.some((item) => {
				return item.player[PLAYER.HUMAN].filled && boxesOver.includes(item.box);
			})
		);
	}, [boxesOver, items, boatToSet]);

	const playerBoatsDone = useMemo(() => {
		const boatLength = BOATS.map((b) => b.length).reduce((a, b) => a + b, 0);
		return (
			items.filter((i) => i.player[PLAYER.HUMAN].filled).length === boatLength
		);
	}, [items]);

	const resetGame = () => {
		window.location.reload();
	};

	const onKeydownHandler = useCallback(
		async ($event: KeyboardEvent) => {
			if ($event.code === 'Space') {
				switchOrientation();

				if (cursorPosition) {
					const boxes = setBoatPosition(cursorPosition);
					updateItems((prevItems) => {
						return prevItems.map((item) => {
							item.over = boxes.includes(item.box);

							return item;
						});
					});
				}
			}
		},
		[cursorPosition, setBoatPosition, switchOrientation, updateItems],
	);

	const onMouseOverBoard = useCallback(
		({ box, row }: BoardBoxItem) => {
			if (!boatToSet) return;

			setCursorPosition({
				box, row, boat: boatToSet.boat.length,
			});
			const boxes = setBoatPosition({
				box, row, boat: boatToSet.boat.length,
			});

			updateItems((prevItems) => {
				return prevItems.map((item) => {
					item.over = boxes.includes(item.box);

					return item;
				});
			});
		},
		[setCursorPosition, setBoatPosition, updateItems, boatToSet],
	);

	const onClickToSetBoatHandler = useCallback(() => {
		if (isConflict) return;
		if (playerBoatsDone) return;
		if (!boatToSet) return;

		updateItems((prevItems) => {
			return prevItems.map((item) => {
				if (boxesOver.includes(item.box)) {
					item.player[PLAYER.HUMAN].filled = boatToSet.boat.id;
				}

				return item;
			});
		});

		if (boatsInGame) {
			if (!boatsInGame[PLAYER.HUMAN]) {
				boatsInGame[PLAYER.HUMAN] = [];
			}
			boatsInGame[PLAYER.HUMAN].push({
				label: boatToSet.boat.label,
				squares: boxesOver,
				length: boxesOver.length,
				id: boatToSet.boat.id,
				sunk: false,
			});
		}

		updateBoatsInGame(boatsInGame);
		setCursorPosition(null);
		boatsForPlayer[boatToSet.key].pending = false;
		boatsForPlayer[boatToSet.key].done = true;
		updateBoatsToSet(null);
		setBoxesOver([]);
		updateItems((prevItems) => {
			return prevItems.map((i) => {
				i.over = false;

				return i;
			});
		});
	}, [boxesOver, boatToSet, playerBoatsDone]);

	const onClickBoatSettings = useCallback((boat: BoatForPlayer, key: number) => {
		if (boat.done) return;

		updateBoatsToSet({ boat, key });

		boatsForPlayer = boatsForPlayer.map((boatForPlayer, boatKey) => {
			boatForPlayer.pending = key === boatKey;
			return boatForPlayer;
		});
	}, []);

	const onClickShowComputerBoatsHandler = useCallback(() => {
		setShowComputerBoats((prev: boolean) => !prev);
	}, []);

	const onMouseLeaveBoard = useCallback(() => {
		updateItems((prevItems) => {
			return prevItems.map((i) => {
				i.over = false;

				return i;
			});
		});
	}, []);

	const onClickStartGame = useCallback(() => {
		if (playersAreReady) {
			setGameReady(true);
		}
	}, [playersAreReady]);

	const onClickBoxToShotHandler = useCallback(
		async (_item: BoardBoxItem) => {
			if (_item.player[PLAYER.HUMAN].shot) return;

			const successShot = _item.player[PLAYER.COMPUTER].filled;

			const isSunk = boatIsSunk({
				items,
				from: PLAYER.HUMAN,
				item: _item,
				boatsInGame,
			});

			updateItems((prevItems: BoardBoxItem[]) => {
				return prevItems.map((item: BoardBoxItem) => {
					if (item.box === _item.box) {
						item.player[PLAYER.HUMAN].shot = {
							value: successShot
								? SHOT_VALUE.TOUCH
								: SHOT_VALUE.WATER,
							date: Date.now(),
							sunk: isSunk,
						};
					}

					return item;
				});
			});

			await wait(500);

			if (successShot) {
				setShotResult({
					type: SHOT_VALUE.TOUCH,
					content: isSunk
						? 'Nice!!!, you sank their boat!!!'
						: 'Nice shot!!! 🙌',
				});
			} else {
				setShotResult({
					type: SHOT_VALUE.WATER,
					content: 'Oops! water!, sharpen your aim 🎯',
				});
			}

			await wait(1000);

			setShotResult(null);
			setTurn(PLAYER.COMPUTER);
		},
		[items, boatsInGame],
	);

	const randomTurn = useCallback(() => {
		const player = [PLAYER.HUMAN, PLAYER.COMPUTER][randomNumber(0, 1)];

		setTurn(player);
	}, []);

	const computerTurnAction = useCallback(async () => {
		await wait(1000);

		const allowedBoxes = items.filter(
			(item) => !item.player[PLAYER.COMPUTER].shot,
		);
		const box = randomNumber(0, allowedBoxes.length);
		const alreadyDone = allowedBoxes.find(
			(item, itemIndex) =>
				itemIndex === box && item.player[PLAYER.COMPUTER].shot,
		);

		if (alreadyDone) {
			computerTurnAction();
			return;
		}

		const item = items.find((item) => {
			return item.box === box;
		});

		const successShot = item?.player[PLAYER.HUMAN].filled;

		const isSunk = boatIsSunk({
			items,
			from: PLAYER.COMPUTER,
			item,
			boatsInGame,
		});

		await updateItems((prevItems: BoardBoxItem[]) => {
			return prevItems.map((item: BoardBoxItem) => {
				if (item.box === box) {
					item.player[PLAYER.COMPUTER].shot = {
						value: successShot
							? SHOT_VALUE.TOUCH
							: SHOT_VALUE.WATER,
						date: Date.now(),
						sunk: isSunk,
					};
				}

				return item;
			});
		});

		await wait(500);

		setTurn(PLAYER.HUMAN);

		if (successShot) {
			setShotResult({
				type: SHOT_VALUE.TOUCH,
				content: isSunk
					? '😵‍💫, the computer finally sank one of your boats.'
					: '😵, the computer hits one of your boats',
			});
		} else {
			setShotResult({
				type: SHOT_VALUE.WATER,
				content: 'Water!! Everyone is save!',
			});
		}

		await wait(1000);

		setShotResult(null);
	}, [items, boatsInGame]);

	const runCounter = useCallback(async () => {
		updateGameCounterLabel(String(counter.value));
		await wait(1000);

		if (counter.value === 1) {
			updateGameCounterValue(0);
			updateGameCounterLabel('goooo!');

			await wait(500);
			updateGameCounterLabel('');

			randomTurn();

			return;
		}

		if (gameReady) {
			updateGameCounterValue(counter.value - 1);
		}
	}, [gameReady, counter]);

	const onClickBoardBox = (item: BoardBoxItem) => {
		if (gameReady) {
			onClickBoxToShotHandler(item);
		} else {
			onClickToSetBoatHandler();
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', onKeydownHandler);

		return () => {
			document.removeEventListener('keydown', onKeydownHandler);
		};
	}, [onKeydownHandler]);

	// INIT
	let mounted = false;
	useEffect(() => {
		if (mounted) return;
		mounted = true;

		const boats: Boat[] = [...BOATS];

		let _items = items;

		while (boats.length) {
			const boat = boats.pop();
			if (!boat) break;

			const box = randomNumber(1, BOARD_SIZE * BOARD_SIZE);
			const row = Math.ceil(box / BOARD_SIZE);
			randomOrientation();

			const boxes = setBoatPosition({ box, row, boat: boat.length });

			const conflict = _items.some((item) => {
				return item.player[PLAYER.COMPUTER].filled && boxes.includes(item.box);
			});

			if (conflict) {
				boats.push(boat);

				continue;
			}

			if (boatsInGame) {
				if (!boatsInGame[PLAYER.COMPUTER]) {
					boatsInGame[PLAYER.COMPUTER] = [];
				}
				boatsInGame[PLAYER.COMPUTER].push({
					label: boat.label,
					squares: boxes,
					length: boxes.length,
					id: boat.id,
					sunk: false,
				});
			}

			_items = _items.map((item) => {
				if (boxes.includes(item.box)) {
					item.player[PLAYER.COMPUTER].filled = boat.id;
				}

				return item;
			});
		}

		updateBoatsInGame(boatsInGame);
		updateItems(_items);
	}, []);

	useEffect(() => {
		if (turn === PLAYER.COMPUTER) {
			computerTurnAction();
		}
	}, [turn]);

	useEffect(() => {
		if (!gameReady || counter.value === 0) return;

		runCounter();
	}, [gameReady, runCounter, counter]);

	if (computerWins) {
		return <ComputerWinsLayout onClickReset={resetGame} />;
	}

	if (humanWins) {
		return <HumanWinsLayout onClickReset={resetGame} />;
	}

	return (
		<>
			{shotResult && <ShotFeedback type={shotResult.type} content={shotResult.content} />}

			<div>
				<div className="flex">
					<div className="flex flex-col">
						<h2 className="text-4xl py-2">Your board</h2>
						<PlayerBoardView
							onClick={onClickBoardBox}
							onMouseOver={onMouseOverBoard}
							onMouseLeave={onMouseLeaveBoard}
							counter={counter}
							board={board}
							gameReady={gameReady}
							turn={turn}
							disableClick={isConflict && !!boatToSet}
							boatsInGame={boatsInGame}
						/>
					</div>

					<div className='w-full'>
						{!gameReady && <BoatSettings
							boats={boatsForPlayer}
							onClickBoat={onClickBoatSettings}
							onClickStartGame={onClickStartGame}
							playerBoatsDone={playerBoatsDone}
							playersAreReady={playersAreReady}
						/>}

						{gameReady && (
							<div className="w-full px-4">
								<h2 className="text-4xl py-2">Scores</h2>

								<ScoreBoard scores={scores} maxScores={maxScores} />

								<GameHistory history={history} />
							</div>
						)}
					</div>
				</div>

				<div className="flex w-full justify-start mt-12">
					<button
						onClick={onClickShowComputerBoatsHandler}
						className="p-2 bg-blue-800 text-white"
					>
						{!showComputerBoats && (
							<span>show computer boats (just to test)</span>
						)}
						{showComputerBoats && <span>hide computer boats</span>}
					</button>
				</div>

				{showComputerBoats && (
					<div>
						<h2>Computer bddoard</h2>
						<ComputerBoard board={board} boatsInGame={boatsInGame} />
						<div></div>
					</div>
				)}
			</div>
		</>
	);
}

export default GameLayout;
