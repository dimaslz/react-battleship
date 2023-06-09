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
import { generateItems } from '@/methods';
import { BOARD_BOX_ITEM, BOAT, BoatForPlayer, CursorPosition, TSHOT_VALUE } from '@/types';
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
	const [boatToSet, setBoatToSet] = useState<{ boat: BoatForPlayer; key: number; } | null>(null);
	const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(null);
	const [shotResult, setShotResult] = useState<{ type: TSHOT_VALUE; content: string; } | null>(null);
	const {
		setBoatPosition,
		switchOrientation,
		randomOrientation,
		setGameReady,
		updateGameCounterValue,
		updateGameCounterLabel,
		gameReady,
		playersAreReady,
		history,
		counter,
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

		const boats: BOAT[] = [...BOATS];

		let _items = items;

		while (boats.length) {
			const boat = boats.pop();
			if (!boat) break;

			const box = randomNumber(1, BOARD_SIZE * BOARD_SIZE);
			const row = Math.ceil(box / BOARD_SIZE);
			randomOrientation();

			const boxes = setBoatPosition({ box, row, boat: boat.squares });

			const conflict = _items.some((item) => {
				return item.player[PLAYER.COMPUTER].filled && boxes.includes(item.box);
			});

			if (conflict) {
				boats.push(boat);

				continue;
			}

			_items = _items.map((item) => {
				if (boxes.includes(item.box)) {
					item.player[PLAYER.COMPUTER].filled = true;
				}

				return item;
			});
		}

		updateItems(_items);
	}, []);

	const onMouseOverBoard = useCallback(
		({ box, row }: BOARD_BOX_ITEM) => {
			if (!boatToSet) return;

			setCursorPosition({ box, row, boat: boatToSet.boat.squares });
			const boxes = setBoatPosition({ box, row, boat: boatToSet.boat.squares });

			updateItems((prevItems) => {
				return prevItems.map((item) => {
					item.over = boxes.includes(item.box);

					return item;
				});
			});
		},
		[setCursorPosition, setBoatPosition, updateItems, boatToSet],
	);

	const playerBoatsDone = useMemo(() => {
		const squares = BOATS.map((b) => b.squares).reduce((a, b) => a + b, 0);
		return (
			items.filter((i) => i.player[PLAYER.HUMAN].filled).length === squares
		);
	}, [items]);

	const onClickToSetBoatHandler = useCallback(() => {
		if (isConflict) return;
		if (playerBoatsDone) return;
		if (!boatToSet) return;

		updateItems((prevItems) => {
			return prevItems.map((item) => {
				if (boxesOver.includes(item.box)) {
					item.player[PLAYER.HUMAN].filled = true;
				}

				return item;
			});
		});

		setCursorPosition(null);
		boatsForPlayer[boatToSet.key].pending = false;
		boatsForPlayer[boatToSet.key].done = true;
		setBoatToSet(null);
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

		setBoatToSet({ boat, key });

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
		async (_item: BOARD_BOX_ITEM) => {
			if (_item.player[PLAYER.HUMAN].shot) return;

			const successShot = _item.player[PLAYER.COMPUTER].filled;

			updateItems((prevItems: BOARD_BOX_ITEM[]) => {
				return prevItems.map((item: BOARD_BOX_ITEM) => {
					const isComputerBoat = item.player[PLAYER.COMPUTER].filled;
					if (item.box === _item.box) {
						item.player[PLAYER.HUMAN].shot = {
							value: isComputerBoat
								? SHOT_VALUE.TOUCH
								: SHOT_VALUE.WATER,
							date: Date.now(),
						};
					}

					return item;
				});
			});

			await wait(500);

			if (successShot) {
				setShotResult({
					type: SHOT_VALUE.TOUCH,
					content: 'Nice shot!!! 🙌',
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
		[items],
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
		const alreadyDone = items.find(
			(item, itemIndex) =>
				itemIndex === box && item.player[PLAYER.COMPUTER].shot,
		);

		if (alreadyDone) {
			computerTurnAction();
			return;
		}

		const successShot = items.find((item) => {
			return item.box === box && item.player[PLAYER.HUMAN].filled;
		});

		await updateItems((prevItems: BOARD_BOX_ITEM[]) => {
			return prevItems.map((item: BOARD_BOX_ITEM) => {
				const isHumanBoat = item.player[PLAYER.HUMAN].filled;
				if (item.box === box) {
					item.player[PLAYER.COMPUTER].shot = {
						value: isHumanBoat
							? SHOT_VALUE.TOUCH
							: SHOT_VALUE.WATER,
						date: Date.now(),
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
				content: '😵, the computer hits one of your boats',
			});
		} else {
			setShotResult({
				type: SHOT_VALUE.WATER,
				content: 'Water!! Everyone is save!',
			});
		}

		await wait(1000);

		setShotResult(null);
	}, [items]);

	useEffect(() => {
		if (turn === PLAYER.COMPUTER) {
			computerTurnAction();
		}
	}, [turn]);

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

	useEffect(() => {
		if (!gameReady || counter.value === 0) return;

		runCounter();
	}, [gameReady, runCounter, counter]);

	const resetGame = () => {
		window.location.reload();
	};

	const onClickBoardBox = (item: BOARD_BOX_ITEM) => {
		if (gameReady) {
			onClickBoxToShotHandler(item);
		} else {
			onClickToSetBoatHandler();
		}
	};

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
						<ComputerBoard board={board} />
						<div></div>
					</div>
				)}
			</div>
		</>
	);
}

export default GameLayout;
